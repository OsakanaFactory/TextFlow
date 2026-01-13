package same.com.textflow.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CountResponse {

    private int totalChars;
    private int totalCharsWithoutSpace;
    private int bytes;
    private int lines;
    private int words;
    private int paragraphs;
    private int manuscripts;
    private int twitterRemaining;
    private int instagramRemaining;
}
