package com.mergen.socialease;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.Timer;
import java.util.TimerTask;

import com.mergen.socialease.model.Admin;
import com.mergen.socialease.model.Ban;
import com.mergen.socialease.service.repository.AdminRepository;
import com.mergen.socialease.service.repository.BanRepository;

@SpringBootApplication
public class SocialeaseApplication {

	private static Timer timer = new Timer ();
	private static Calendar calendar;
	private static BanRepository banRepository;
	public static void main(String[] args) {
		timer.schedule (hourlyTask, 0l, 1000*60*60);
        SpringApplication.run(SocialeaseApplication.class, args);
    }
	
	@Bean
	CommandLineRunner createInitialAdmin(AdminRepository adminRepository) {
		PasswordEncoder passEncoder = new BCryptPasswordEncoder();
		return (args) -> {
			Admin admin= new Admin();
			admin.setUsername("admin");
			admin.setPassword(passEncoder.encode("Root123456"));
			if(adminRepository.findByUsername("admin")==null) {
				adminRepository.save(admin);
			}
		};
	}

	static TimerTask hourlyTask = new TimerTask () {
		@Override
		public void run () {
			Date date = calendar.getInstance().getTime();
			try {
				ArrayList<Ban> bans = banRepository.findAllByisDismissed(false);
				for(Ban b : bans){
					if(date.compareTo(b.getBannedUntil())>0){
						b.setActive(false);
						banRepository.save(b);
					}
				}
			}
			catch(Exception e) {
			
			}
		}
	};
}
