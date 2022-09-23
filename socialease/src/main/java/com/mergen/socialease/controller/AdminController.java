package com.mergen.socialease.controller;

import java.util.Base64;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.annotation.JsonView;
import com.mergen.socialease.error.ErrorResponse;
import com.mergen.socialease.model.Admin;
import com.mergen.socialease.service.repository.AdminRepository;
import com.mergen.socialease.shared.CurrentUser;
import com.mergen.socialease.shared.Views;

@RestController
public class AdminController {
	
	@Autowired
	private AdminRepository adminRepository;
	
	PasswordEncoder passEncoder = new BCryptPasswordEncoder();
	
	@PostMapping("/mergen/admin/login")
	@JsonView(Views.Base.class)
	public ResponseEntity<?> adminLogin(@CurrentUser Admin admin){
		return ResponseEntity.ok(admin);
	}

}
