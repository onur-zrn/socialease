package com.mergen.socialease.service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mergen.socialease.model.SubClubAdminRequest;

public interface SubClubAdminRequestRepository extends JpaRepository<SubClubAdminRequest, Long> {
	SubClubAdminRequest findBysubClubAdminRequestid(long subClubAdminRequestid);
	
}

