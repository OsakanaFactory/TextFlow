package same.com.textflow.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import same.com.textflow.entity.DiffHistory;
import same.com.textflow.entity.User;

import java.util.Optional;

@Repository
public interface DiffHistoryRepository extends JpaRepository<DiffHistory, Long> {

    Page<DiffHistory> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);

    Optional<DiffHistory> findByIdAndUser(Long id, User user);

    long countByUser(User user);
}
