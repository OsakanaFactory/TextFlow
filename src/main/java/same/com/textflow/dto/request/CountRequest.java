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
public class CountRequest {

    @NotBlank(message = "テキストは必須です")
    @Size(max = 100000, message = "テキストは100,000文字以内で入力してください")
    private String text;
}
