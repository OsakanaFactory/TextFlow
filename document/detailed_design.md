# TextFlow 詳細設計書

**バージョン**: 1.0  
**作成日**: 2026-01-13  
**最終更新日**: 2026-01-13

---

## 1. バックエンド詳細設計

### 1.1 プロジェクト構成

```
src/main/java/com/textflow/
├── TextFlowApplication.java
├── config/
│   ├── SecurityConfig.java
│   ├── CorsConfig.java
│   └── WebConfig.java
├── controller/
│   ├── AuthController.java
│   ├── UserController.java
│   ├── HistoryController.java
│   └── CountController.java
├── service/
│   ├── AuthService.java
│   ├── UserService.java
│   ├── HistoryService.java
│   └── CountService.java
├── repository/
│   ├── UserRepository.java
│   ├── TextHistoryRepository.java
│   └── DiffHistoryRepository.java
├── entity/
│   ├── User.java
│   ├── TextHistory.java
│   └── DiffHistory.java
├── dto/
│   ├── request/
│   │   ├── LoginRequest.java
│   │   ├── RegisterRequest.java
│   │   ├── CountRequest.java
│   │   └── HistoryRequest.java
│   └── response/
│       ├── AuthResponse.java
│       ├── CountResponse.java
│       ├── HistoryResponse.java
│       └── ErrorResponse.java
├── security/
│   ├── JwtTokenProvider.java
│   ├── JwtAuthenticationFilter.java
│   └── UserDetailsServiceImpl.java
├── exception/
│   ├── GlobalExceptionHandler.java
│   ├── ResourceNotFoundException.java
│   └── ValidationException.java
└── util/
    └── CharacterCounter.java
```

### 1.2 Entity設計

#### User.java
```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true, length = 50)
    private String username;
    
    @Column(nullable = false, unique = true, length = 255)
    private String email;
    
    @Column(name = "password_hash", nullable = false)
    private String passwordHash;
    
    @Column(nullable = false, length = 20)
    private String plan = "free";
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<TextHistory> textHistories;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
```

#### TextHistory.java
```java
@Entity
@Table(name = "text_histories")
public class TextHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(nullable = false, length = 100)
    private String title;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;
    
    @Column(name = "content_type", nullable = false, length = 20)
    private String contentType = "plain";
    
    @Column(name = "char_count", nullable = false)
    private Integer charCount = 0;
    
    @Column(name = "line_count", nullable = false)
    private Integer lineCount = 0;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
```

### 1.3 Controller設計

#### AuthController.java
```java
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthService authService;
    
    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(
            @Valid @RequestBody RegisterRequest request) {
        UserResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/logout")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> logout() {
        // JWT はステートレスなので、クライアント側でトークン削除
        return ResponseEntity.ok().build();
    }
}
```

#### HistoryController.java
```java
@RestController
@RequestMapping("/api/histories")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class HistoryController {
    
    private final HistoryService historyService;
    
    @GetMapping
    public ResponseEntity<Page<HistoryResponse>> getHistories(
            @AuthenticationPrincipal UserDetails userDetails,
            @PageableDefault(size = 20, sort = "createdAt", 
                direction = Sort.Direction.DESC) Pageable pageable) {
        Page<HistoryResponse> histories = 
            historyService.getHistories(userDetails.getUsername(), pageable);
        return ResponseEntity.ok(histories);
    }
    
    @PostMapping
    public ResponseEntity<HistoryResponse> createHistory(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody HistoryRequest request) {
        HistoryResponse response = 
            historyService.createHistory(userDetails.getUsername(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<HistoryDetailResponse> getHistory(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        HistoryDetailResponse response = 
            historyService.getHistory(userDetails.getUsername(), id);
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHistory(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        historyService.deleteHistory(userDetails.getUsername(), id);
        return ResponseEntity.noContent().build();
    }
    
    @PostMapping("/import")
    public ResponseEntity<ImportResponse> importHistories(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ImportRequest request) {
        ImportResponse response = 
            historyService.importHistories(userDetails.getUsername(), request);
        return ResponseEntity.ok(response);
    }
}
```

### 1.4 Service設計

#### CountService.java
```java
@Service
public class CountService {
    
    public CountResponse count(CountRequest request) {
        String text = request.getText();
        
        int totalChars = text.length();
        int totalCharsWithoutSpace = text.replaceAll("\\s", "").length();
        int bytes = text.getBytes(StandardCharsets.UTF_8).length;
        int lines = text.isEmpty() ? 0 : text.split("\n", -1).length;
        int words = countWords(text);
        int paragraphs = countParagraphs(text);
        int manuscripts = (int) Math.ceil(totalChars / 400.0);
        
        return CountResponse.builder()
            .totalChars(totalChars)
            .totalCharsWithoutSpace(totalCharsWithoutSpace)
            .bytes(bytes)
            .lines(lines)
            .words(words)
            .paragraphs(paragraphs)
            .manuscripts(manuscripts)
            .twitterRemaining(Math.max(0, 140 - totalChars))
            .instagramRemaining(Math.max(0, 2200 - totalChars))
            .build();
    }
    
    private int countWords(String text) {
        if (text.trim().isEmpty()) return 0;
        // 英単語をカウント（日本語は1文字=1単語としてカウント）
        String[] words = text.trim().split("\\s+");
        return words.length;
    }
    
    private int countParagraphs(String text) {
        if (text.trim().isEmpty()) return 0;
        String[] paragraphs = text.split("\n\n+");
        return (int) Arrays.stream(paragraphs)
            .filter(p -> !p.trim().isEmpty())
            .count();
    }
}
```

### 1.5 Security設計

#### JwtTokenProvider.java
```java
@Component
public class JwtTokenProvider {
    
    @Value("${app.jwt.secret}")
    private String jwtSecret;
    
    @Value("${app.jwt.expiration-ms}")
    private int jwtExpirationMs;
    
    public String generateToken(UserDetails userDetails) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);
        
        return Jwts.builder()
            .setSubject(userDetails.getUsername())
            .setIssuedAt(now)
            .setExpiration(expiryDate)
            .signWith(SignatureAlgorithm.HS256, jwtSecret)
            .compact();
    }
    
    public String getUsernameFromToken(String token) {
        Claims claims = Jwts.parser()
            .setSigningKey(jwtSecret)
            .parseClaimsJws(token)
            .getBody();
        return claims.getSubject();
    }
    
    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
```

#### SecurityConfig.java
```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final UserDetailsService userDetailsService;
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/count").permitAll()
                .requestMatchers("/api/docs/**", "/swagger-ui/**").permitAll()
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, 
                UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of(
            "http://localhost:5173",
            "https://textflow.vercel.app"
        ));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = 
            new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

---

## 2. フロントエンド詳細設計

### 2.1 プロジェクト構成

```
frontend/
├── public/
│   └── locales/
│       ├── ja/translation.json
│       └── en/translation.json
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── TextArea.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── Toast.tsx
│   │   ├── counter/
│   │   │   ├── CounterInput.tsx
│   │   │   └── CounterStats.tsx
│   │   ├── diff/
│   │   │   ├── DiffInput.tsx
│   │   │   ├── DiffViewer.tsx
│   │   │   └── DiffStats.tsx
│   │   └── history/
│   │       ├── HistoryList.tsx
│   │       └── HistoryItem.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Counter.tsx
│   │   ├── Diff.tsx
│   │   ├── History.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   └── Profile.tsx
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   ├── ThemeContext.tsx
│   │   └── HistoryContext.tsx
│   ├── hooks/
│   │   ├── useCharCount.ts
│   │   ├── useDiff.ts
│   │   ├── useHistory.ts
│   │   ├── useAuth.ts
│   │   └── useTheme.ts
│   ├── services/
│   │   ├── api.ts
│   │   ├── authService.ts
│   │   └── historyService.ts
│   ├── workers/
│   │   └── diffWorker.ts
│   ├── utils/
│   │   ├── charCount.ts
│   │   └── formatters.ts
│   ├── types/
│   │   └── index.ts
│   ├── i18n.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

### 2.2 主要コンポーネント設計

#### useCharCount.ts
```typescript
interface CharCountResult {
  totalChars: number;
  totalCharsWithoutSpace: number;
  bytes: number;
  lines: number;
  words: number;
  paragraphs: number;
  manuscripts: number;
  twitterRemaining: number;
  instagramRemaining: number;
}

export function useCharCount(text: string): CharCountResult {
  return useMemo(() => {
    const totalChars = text.length;
    const totalCharsWithoutSpace = text.replace(/\s/g, '').length;
    const bytes = new Blob([text]).size;
    const lines = text === '' ? 0 : text.split('\n').length;
    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    const paragraphs = text.trim() === '' ? 0 
      : text.split(/\n\n+/).filter(p => p.trim()).length;
    const manuscripts = Math.ceil(totalChars / 400);
    
    return {
      totalChars,
      totalCharsWithoutSpace,
      bytes,
      lines,
      words,
      paragraphs,
      manuscripts,
      twitterRemaining: Math.max(0, 140 - totalChars),
      instagramRemaining: Math.max(0, 2200 - totalChars),
    };
  }, [text]);
}
```

#### useDiff.ts（Web Worker使用）
```typescript
import { useEffect, useState } from 'react';

interface DiffResult {
  hunks: DiffHunk[];
  addedLines: number;
  deletedLines: number;
  changedLines: number;
  changeRate: number;
  isLoading: boolean;
}

export function useDiff(textBefore: string, textAfter: string): DiffResult {
  const [result, setResult] = useState<DiffResult>({
    hunks: [],
    addedLines: 0,
    deletedLines: 0,
    changedLines: 0,
    changeRate: 0,
    isLoading: false,
  });
  
  useEffect(() => {
    if (!textBefore && !textAfter) {
      setResult(prev => ({ ...prev, hunks: [], isLoading: false }));
      return;
    }
    
    setResult(prev => ({ ...prev, isLoading: true }));
    
    const worker = new Worker(
      new URL('../workers/diffWorker.ts', import.meta.url),
      { type: 'module' }
    );
    
    worker.postMessage({ textBefore, textAfter });
    
    worker.onmessage = (e) => {
      setResult({
        ...e.data,
        isLoading: false,
      });
      worker.terminate();
    };
    
    return () => worker.terminate();
  }, [textBefore, textAfter]);
  
  return result;
}
```

#### diffWorker.ts
```typescript
import { diffLines } from 'diff';

self.onmessage = (e: MessageEvent) => {
  const { textBefore, textAfter } = e.data;
  
  const diff = diffLines(textBefore, textAfter);
  
  let addedLines = 0;
  let deletedLines = 0;
  let changedLines = 0;
  
  const hunks = diff.map(part => {
    const lines = part.value.split('\n').filter(l => l !== '');
    const count = lines.length;
    
    if (part.added) {
      addedLines += count;
      return { type: 'added', lines, count };
    } else if (part.removed) {
      deletedLines += count;
      return { type: 'deleted', lines, count };
    } else {
      return { type: 'unchanged', lines, count };
    }
  });
  
  const totalLines = Math.max(
    textBefore.split('\n').length,
    textAfter.split('\n').length
  );
  const changeRate = totalLines > 0 
    ? ((addedLines + deletedLines) / totalLines) * 100 
    : 0;
  
  self.postMessage({
    hunks,
    addedLines,
    deletedLines,
    changedLines,
    changeRate: Math.round(changeRate * 10) / 10,
  });
};
```

### 2.3 localStorage自動移行

#### useHistoryMigration.ts
```typescript
export function useHistoryMigration() {
  const { isAuthenticated, user } = useAuth();
  const { showToast } = useToast();
  const { t } = useTranslation();
  
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const migrateHistories = async () => {
      const localHistories = localStorage.getItem('textflow_histories');
      if (!localHistories) return;
      
      try {
        const histories = JSON.parse(localHistories);
        if (histories.length === 0) return;
        
        const response = await historyService.importHistories(histories);
        
        // 成功したらlocalStorageを削除
        localStorage.removeItem('textflow_histories');
        
        showToast({
          type: 'success',
          message: t('history.importSuccess', { count: response.imported }),
        });
      } catch (error) {
        console.error('Failed to migrate histories:', error);
      }
    };
    
    migrateHistories();
  }, [isAuthenticated]);
}
```

### 2.4 国際化設定

#### i18n.ts
```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'ja',
    supportedLngs: ['ja', 'en'],
    debug: import.meta.env.DEV,
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
```

#### ja/translation.json
```json
{
  "common": {
    "appName": "TextFlow",
    "login": "ログイン",
    "logout": "ログアウト",
    "register": "新規登録",
    "save": "保存",
    "cancel": "キャンセル",
    "delete": "削除",
    "copy": "コピー",
    "copied": "コピーしました",
    "darkMode": "ダークモード",
    "lightMode": "ライトモード"
  },
  "counter": {
    "title": "文字数カウント",
    "placeholder": "テキストを入力してください...",
    "totalChars": "総文字数",
    "totalCharsWithoutSpace": "空白なし",
    "bytes": "バイト数",
    "lines": "行数",
    "words": "単語数",
    "paragraphs": "段落数",
    "manuscripts": "原稿用紙換算",
    "twitter": "Twitter/X",
    "instagram": "Instagram",
    "remaining": "残り",
    "exceeded": "超過"
  },
  "diff": {
    "title": "差分比較",
    "text1": "テキスト1",
    "text2": "テキスト2",
    "sideBySide": "横並び表示",
    "unified": "統合表示",
    "added": "追加",
    "deleted": "削除",
    "changed": "変更",
    "changeRate": "変更率",
    "lines": "行"
  },
  "history": {
    "title": "履歴",
    "noHistory": "履歴がありません",
    "search": "検索...",
    "importSuccess": "{{count}}件の履歴をインポートしました",
    "deleteConfirm": "この履歴を削除しますか？",
    "guestLimit": "ゲストモードでは5件まで保存できます"
  },
  "auth": {
    "email": "メールアドレス",
    "password": "パスワード",
    "username": "ユーザー名",
    "loginTitle": "ログイン",
    "registerTitle": "アカウント作成",
    "noAccount": "アカウントをお持ちでない方",
    "hasAccount": "既にアカウントをお持ちの方",
    "loginError": "メールアドレスまたはパスワードが正しくありません",
    "registerError": "登録に失敗しました"
  }
}
```

#### en/translation.json
```json
{
  "common": {
    "appName": "TextFlow",
    "login": "Login",
    "logout": "Logout",
    "register": "Sign Up",
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "copy": "Copy",
    "copied": "Copied!",
    "darkMode": "Dark Mode",
    "lightMode": "Light Mode"
  },
  "counter": {
    "title": "Character Count",
    "placeholder": "Enter your text here...",
    "totalChars": "Total Characters",
    "totalCharsWithoutSpace": "Without Spaces",
    "bytes": "Bytes",
    "lines": "Lines",
    "words": "Words",
    "paragraphs": "Paragraphs",
    "manuscripts": "Manuscript Pages",
    "twitter": "Twitter/X",
    "instagram": "Instagram",
    "remaining": "remaining",
    "exceeded": "exceeded"
  },
  "diff": {
    "title": "Diff Compare",
    "text1": "Text 1",
    "text2": "Text 2",
    "sideBySide": "Side by Side",
    "unified": "Unified",
    "added": "Added",
    "deleted": "Deleted",
    "changed": "Changed",
    "changeRate": "Change Rate",
    "lines": "lines"
  },
  "history": {
    "title": "History",
    "noHistory": "No history found",
    "search": "Search...",
    "importSuccess": "Imported {{count}} histories",
    "deleteConfirm": "Delete this history?",
    "guestLimit": "Guest mode allows up to 5 histories"
  },
  "auth": {
    "email": "Email",
    "password": "Password",
    "username": "Username",
    "loginTitle": "Login",
    "registerTitle": "Create Account",
    "noAccount": "Don't have an account?",
    "hasAccount": "Already have an account?",
    "loginError": "Invalid email or password",
    "registerError": "Registration failed"
  }
}
```

---

## 3. テスト設計

### 3.1 バックエンドテスト

#### CountServiceTest.java
```java
@SpringBootTest
class CountServiceTest {
    
    @Autowired
    private CountService countService;
    
    @Test
    void count_emptyText_returnsZeros() {
        CountRequest request = new CountRequest("");
        CountResponse response = countService.count(request);
        
        assertThat(response.getTotalChars()).isEqualTo(0);
        assertThat(response.getLines()).isEqualTo(0);
    }
    
    @Test
    void count_japaneseText_countsCorrectly() {
        CountRequest request = new CountRequest("こんにちは世界");
        CountResponse response = countService.count(request);
        
        assertThat(response.getTotalChars()).isEqualTo(7);
        assertThat(response.getTotalCharsWithoutSpace()).isEqualTo(7);
    }
    
    @Test
    void count_multilineText_countsLinesCorrectly() {
        CountRequest request = new CountRequest("line1\nline2\nline3");
        CountResponse response = countService.count(request);
        
        assertThat(response.getLines()).isEqualTo(3);
    }
}
```

### 3.2 フロントエンドテスト

#### useCharCount.test.ts
```typescript
import { renderHook } from '@testing-library/react';
import { useCharCount } from './useCharCount';

describe('useCharCount', () => {
  it('returns zeros for empty string', () => {
    const { result } = renderHook(() => useCharCount(''));
    
    expect(result.current.totalChars).toBe(0);
    expect(result.current.lines).toBe(0);
  });
  
  it('counts Japanese characters correctly', () => {
    const { result } = renderHook(() => useCharCount('こんにちは'));
    
    expect(result.current.totalChars).toBe(5);
  });
  
  it('calculates Twitter remaining correctly', () => {
    const text = 'a'.repeat(100);
    const { result } = renderHook(() => useCharCount(text));
    
    expect(result.current.twitterRemaining).toBe(40);
  });
  
  it('shows exceeded for Twitter when over limit', () => {
    const text = 'a'.repeat(150);
    const { result } = renderHook(() => useCharCount(text));
    
    expect(result.current.twitterRemaining).toBe(0);
  });
});
```

---

## 4. 環境設定

### 4.1 application.yml（バックエンド）
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/textflow
    username: textflow
    password: ${DB_PASSWORD:textflow_dev}
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: true

app:
  jwt:
    secret: ${JWT_SECRET:your-secret-key-min-32-chars-long}
    expiration-ms: 3600000

server:
  port: 8080

logging:
  level:
    com.textflow: INFO
    org.springframework.security: WARN
```

### 4.2 docker-compose.yml（開発環境）
```yaml
version: '3.8'
services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: textflow
      POSTGRES_USER: textflow
      POSTGRES_PASSWORD: textflow_dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql

volumes:
  postgres_data:
```

### 4.3 .env（フロントエンド）
```env
VITE_API_URL=http://localhost:8080/api
VITE_APP_NAME=TextFlow
```

---

## 変更履歴

| バージョン | 日付 | 変更内容 |
|-----------|------|---------|
| 1.0 | 2026-01-13 | 初版作成 |
