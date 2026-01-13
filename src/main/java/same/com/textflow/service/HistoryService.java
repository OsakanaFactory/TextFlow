package same.com.textflow.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import same.com.textflow.dto.request.HistoryRequest;
import same.com.textflow.dto.request.ImportRequest;
import same.com.textflow.dto.response.HistoryDetailResponse;
import same.com.textflow.dto.response.HistoryResponse;
import same.com.textflow.dto.response.ImportResponse;
import same.com.textflow.entity.TextHistory;
import same.com.textflow.entity.User;
import same.com.textflow.exception.ResourceNotFoundException;
import same.com.textflow.repository.TextHistoryRepository;

import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
public class HistoryService {

    private final TextHistoryRepository textHistoryRepository;
    private final UserService userService;

    @Transactional(readOnly = true)
    public Page<HistoryResponse> getHistories(String email, Pageable pageable) {
        User user = userService.getUserByEmail(email);
        Page<TextHistory> histories = textHistoryRepository.findByUserOrderByCreatedAtDesc(user, pageable);

        return histories.map(this::mapToHistoryResponse);
    }

    @Transactional(readOnly = true)
    public Page<HistoryResponse> searchHistories(String email, String query, Pageable pageable) {
        User user = userService.getUserByEmail(email);
        Page<TextHistory> histories = textHistoryRepository
                .findByUserAndTitleContainingIgnoreCaseOrderByCreatedAtDesc(user, query, pageable);

        return histories.map(this::mapToHistoryResponse);
    }

    @Transactional
    public HistoryResponse createHistory(String email, HistoryRequest request) {
        User user = userService.getUserByEmail(email);

        String title = request.getTitle();
        if (title == null || title.isEmpty()) {
            // Generate title from first 30 characters of content
            title = request.getContent().length() > 30
                    ? request.getContent().substring(0, 30) + "..."
                    : request.getContent();
        }

        String content = request.getContent();
        int charCount = content.length();
        int lineCount = content.isEmpty() ? 0 : content.split("\n", -1).length;

        TextHistory history = TextHistory.builder()
                .user(user)
                .title(title)
                .content(content)
                .contentType(request.getContentType() != null ? request.getContentType() : "plain")
                .charCount(charCount)
                .lineCount(lineCount)
                .build();

        TextHistory savedHistory = textHistoryRepository.save(history);
        return mapToHistoryResponse(savedHistory);
    }

    @Transactional(readOnly = true)
    public HistoryDetailResponse getHistory(String email, Long id) {
        User user = userService.getUserByEmail(email);
        TextHistory history = textHistoryRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("History", "id", id));

        return mapToHistoryDetailResponse(history);
    }

    @Transactional
    public void deleteHistory(String email, Long id) {
        User user = userService.getUserByEmail(email);
        TextHistory history = textHistoryRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("History", "id", id));

        textHistoryRepository.delete(history);
    }

    @Transactional
    public ImportResponse importHistories(String email, ImportRequest request) {
        User user = userService.getUserByEmail(email);
        int importedCount = 0;

        for (ImportRequest.ImportItem item : request.getHistories()) {
            String content = item.getContent();
            if (content == null || content.isEmpty()) {
                continue;
            }

            String title = item.getTitle();
            if (title == null || title.isEmpty()) {
                title = content.length() > 30
                        ? content.substring(0, 30) + "..."
                        : content;
            }

            int charCount = content.length();
            int lineCount = content.isEmpty() ? 0 : content.split("\n", -1).length;

            TextHistory history = TextHistory.builder()
                    .user(user)
                    .title(title)
                    .content(content)
                    .contentType(item.getContentType() != null ? item.getContentType() : "plain")
                    .charCount(charCount)
                    .lineCount(lineCount)
                    .build();

            textHistoryRepository.save(history);
            importedCount++;
        }

        return ImportResponse.builder()
                .imported(importedCount)
                .message(importedCount + "件の履歴をインポートしました")
                .build();
    }

    private HistoryResponse mapToHistoryResponse(TextHistory history) {
        return HistoryResponse.builder()
                .id(history.getId())
                .title(history.getTitle())
                .charCount(history.getCharCount())
                .lineCount(history.getLineCount())
                .contentType(history.getContentType())
                .createdAt(history.getCreatedAt())
                .updatedAt(history.getUpdatedAt())
                .build();
    }

    private HistoryDetailResponse mapToHistoryDetailResponse(TextHistory history) {
        return HistoryDetailResponse.builder()
                .id(history.getId())
                .title(history.getTitle())
                .content(history.getContent())
                .contentType(history.getContentType())
                .charCount(history.getCharCount())
                .lineCount(history.getLineCount())
                .createdAt(history.getCreatedAt())
                .updatedAt(history.getUpdatedAt())
                .build();
    }
}
