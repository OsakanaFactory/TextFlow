package same.com.textflow.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import same.com.textflow.entity.TextHistory;
import same.com.textflow.entity.User;

import java.util.Optional;

@Repository
public interface TextHistoryRepository extends JpaRepository<TextHistory, Long> {

    Page<TextHistory> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);

    Page<TextHistory> findByUserAndTitleContainingIgnoreCaseOrderByCreatedAtDesc(
            User user, String title, Pageable pageable);

    Optional<TextHistory> findByIdAndUser(Long id, User user);

    long countByUser(User user);

    void deleteByIdAndUser(Long id, User user);
}
