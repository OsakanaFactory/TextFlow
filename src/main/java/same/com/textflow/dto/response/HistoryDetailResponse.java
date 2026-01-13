package same.com.textflow.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HistoryDetailResponse {

    private Long id;
    private String title;
    private String content;
    private String contentType;
    private Integer charCount;
    private Integer lineCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
