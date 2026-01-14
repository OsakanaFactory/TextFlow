package same.com.textflow.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import same.com.textflow.dto.request.HistoryRequest;
import same.com.textflow.dto.request.ImportRequest;
import same.com.textflow.dto.response.HistoryResponse;
import same.com.textflow.dto.response.ImportResponse;
import same.com.textflow.entity.TextHistory;
import same.com.textflow.entity.User;
import same.com.textflow.repository.TextHistoryRepository;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class HistoryServiceTest {

    @Mock
    private TextHistoryRepository textHistoryRepository;

    @Mock
    private UserService userService;

    @InjectMocks
    private HistoryService historyService;

    private User testUser;
    private TextHistory testHistory;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .email("test@example.com")
                .username("testuser")
                .build();

        testHistory = TextHistory.builder()
                .id(1L)
                .user(testUser)
                .title("Test Title")
                .content("Test Content")
                .contentType("plain")
                .charCount(12)
                .lineCount(1)
                .createdAt(LocalDateTime.now())
                .build();
    }

    @Test
    void createHistory_ShouldSaveAndReturnResponse() {
        // Arrange
        HistoryRequest request = new HistoryRequest();
        request.setTitle("New History");
        request.setContent("This is a test content.");
        request.setContentType("plain");

        when(userService.getUserByEmail(anyString())).thenReturn(testUser);
        when(textHistoryRepository.save(any(TextHistory.class))).thenAnswer(invocation -> {
            TextHistory h = invocation.getArgument(0);
            h.setId(2L);
            return h;
        });

        // Act
        HistoryResponse response = historyService.createHistory("test@example.com", request);

        // Assert
        assertThat(response).isNotNull();
        assertThat(response.getTitle()).isEqualTo("New History");
        assertThat(response.getCharCount()).isEqualTo(request.getContent().length());
        verify(textHistoryRepository, times(1)).save(any(TextHistory.class));
    }

    @Test
    void createHistory_WithEmptyTitle_ShouldGenerateTitle() {
        // Arrange
        HistoryRequest request = new HistoryRequest();
        request.setContent("Long content that should be truncated for title generation purpose.");

        when(userService.getUserByEmail(anyString())).thenReturn(testUser);
        when(textHistoryRepository.save(any(TextHistory.class))).thenAnswer(i -> i.getArgument(0));

        // Act
        HistoryResponse response = historyService.createHistory("test@example.com", request);

        // Assert
        assertThat(response.getTitle()).startsWith("Long content that should be tr");
        assertThat(response.getTitle()).endsWith("...");
    }

    @Test
    void getHistories_ShouldReturnPage() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 10);
        Page<TextHistory> page = new PageImpl<>(List.of(testHistory));

        when(userService.getUserByEmail(anyString())).thenReturn(testUser);
        when(textHistoryRepository.findByUserOrderByCreatedAtDesc(any(User.class), any(Pageable.class)))
                .thenReturn(page);

        // Act
        Page<HistoryResponse> result = historyService.getHistories("test@example.com", pageable);

        // Assert
        assertThat(result).hasSize(1);
        assertThat(result.getContent().get(0).getTitle()).isEqualTo("Test Title");
    }

    @Test
    void importHistories_ShouldSaveAllValidItems() {
        // Arrange
        ImportRequest request = new ImportRequest();
        ImportRequest.ImportItem item1 = new ImportRequest.ImportItem();
        item1.setContent("Content 1");
        ImportRequest.ImportItem item2 = new ImportRequest.ImportItem();
        item2.setContent("Content 2");
        request.setHistories(List.of(item1, item2));

        when(userService.getUserByEmail(anyString())).thenReturn(testUser);

        // Act
        ImportResponse response = historyService.importHistories("test@example.com", request);

        // Assert
        assertThat(response.getImported()).isEqualTo(2);
        verify(textHistoryRepository, times(2)).save(any(TextHistory.class));
    }
}
