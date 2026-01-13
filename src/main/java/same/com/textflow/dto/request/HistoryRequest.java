package same.com.textflow.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HistoryRequest {

    @Size(max = 100, message = "タイトルは100文字以内で入力してください")
    private String title;

    @NotBlank(message = "コンテンツは必須です")
    @Size(max = 100000, message = "コンテンツは100,000文字以内で入力してください")
    private String content;

    @Builder.Default
    private String contentType = "plain";
}
