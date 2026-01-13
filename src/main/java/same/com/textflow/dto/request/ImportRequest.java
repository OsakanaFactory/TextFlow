package same.com.textflow.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ImportRequest {

    @NotEmpty(message = "インポートする履歴が必要です")
    @Valid
    private List<ImportItem> histories;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ImportItem {
        private String title;
        private String content;
        private String contentType;
        private LocalDateTime createdAt;
    }
}
