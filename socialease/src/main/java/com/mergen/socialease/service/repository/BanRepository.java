package com.mergen.socialease.service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.ArrayList;
import com.mergen.socialease.model.Ban;

public interface BanRepository extends JpaRepository<Ban, Long> {
	Ban findBybanid(long banid);
	ArrayList<Ban> findAllByuserName(String userName);
    ArrayList<Ban> findAllBysubClubid(Long subClubid);
	ArrayList<Ban> findAllByisDismissed(Boolean isDismissed);
	Ban findByUserNameAndSubClubid(String userName, Long subClubid);
}
