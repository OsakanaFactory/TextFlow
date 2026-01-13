package same.com.textflow.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "diff_histories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DiffHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(name = "text_before", nullable = false, columnDefinition = "TEXT")
    private String textBefore;

    @Column(name = "text_after", nullable = false, columnDefinition = "TEXT")
    private String textAfter;

    @Column(name = "added_lines", nullable = false)
    @Builder.Default
    private Integer addedLines = 0;

    @Column(name = "deleted_lines", nullable = false)
    @Builder.Default
    private Integer deletedLines = 0;

    @Column(name = "changed_lines", nullable = false)
    @Builder.Default
    private Integer changedLines = 0;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
