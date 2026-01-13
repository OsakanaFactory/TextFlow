package same.com.textflow.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import same.com.textflow.dto.request.LoginRequest;
import same.com.textflow.dto.request.RegisterRequest;
import same.com.textflow.dto.response.AuthResponse;
import same.com.textflow.dto.response.UserResponse;
import same.com.textflow.service.AuthService;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "認証API")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "ユーザー登録", description = "新規ユーザーを登録します")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest request) {
        UserResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    @Operation(summary = "ログイン", description = "ユーザー認証を行い、JWTトークンを返します")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    @Operation(summary = "ログアウト", description = "ログアウト処理（クライアント側でトークン削除）")
    public ResponseEntity<Void> logout() {
        // JWT is stateless, so logout is handled on client-side
        return ResponseEntity.ok().build();
    }
}
