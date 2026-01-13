package same.com.textflow.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import same.com.textflow.dto.request.CountRequest;
import same.com.textflow.dto.response.CountResponse;
import same.com.textflow.service.CountService;

@RestController
@RequestMapping("/api/count")
@RequiredArgsConstructor
@Tag(name = "Character Count", description = "文字数カウントAPI")
public class CountController {

    private final CountService countService;

    @PostMapping
    @Operation(summary = "文字数カウント", description = "テキストの文字数、バイト数、行数などをカウントします")
    public ResponseEntity<CountResponse> count(@Valid @RequestBody CountRequest request) {
        CountResponse response = countService.count(request);
        return ResponseEntity.ok(response);
    }
}
