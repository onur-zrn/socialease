package com.mergen.socialease.controller;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Calendar;
import java.util.Date;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.mergen.socialease.model.Admin;
import com.mergen.socialease.model.Ban;
import com.mergen.socialease.model.Club;
import com.mergen.socialease.model.Question;
import com.mergen.socialease.model.SubClub;
import com.mergen.socialease.model.SubClubAdminRequest;
import com.mergen.socialease.model.User;
import com.mergen.socialease.model.Report;
import com.mergen.socialease.req_classes.SurveyAnswers;
import com.mergen.socialease.req_classes.SurveyAnswersWithUserId;
import com.mergen.socialease.req_classes.SurveyQuestion;
import com.mergen.socialease.service.repository.BanRepository;
import com.mergen.socialease.service.repository.ClubRepository;
import com.mergen.socialease.service.repository.QuestionRepository;
import com.mergen.socialease.service.repository.SubClubAdminRequestRepository;
import com.mergen.socialease.service.repository.SubClubRepository;
import com.mergen.socialease.service.repository.ReportRepository;
import com.mergen.socialease.service.repository.UserRepository;
import com.mergen.socialease.shared.CurrentUser;
import com.mergen.socialease.shared.GenericResponse;

@RestController
public class SubClubController {
	@Autowired
	private ClubRepository clubRepository;

	@Autowired
	private SubClubRepository subClubRepository;

	@Autowired
	private QuestionRepository questionRepository;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private ReportRepository reportRepository;

	@Autowired
	private BanRepository banRepository;

	private Calendar calendar;

	@PostMapping("/report")
	public GenericResponse report(@RequestBody Report r, @CurrentUser User user) {
		if (r.getReportType() != 1) {
			return new GenericResponse("Error: Type is wrong!");
		}
		if (r.getReported() == null || r.getReported().equals("") || r.getReporter() == null
				|| r.getReporter().equals("")) {
			return new GenericResponse("Error: Something is wrong!");
		}
		if (r.getExplanation() == null || r.getExplanation() == "") {
			return new GenericResponse("Error: invalid-explanation");
		}
		try {
			User u = userRepository.findByUsername(r.getReported());
			String sCString = u.getSubClubList();
			String[] scList = sCString.split(",");
			Long SCID = r.getSubClubid();
			boolean check1 = true;
			for (int i = 0; i < scList.length; i++) {
				String x = scList[i].split("-")[0];
				x=x.substring(1, x.length());
				if (SCID == Long.parseLong(x)) {
					check1 = false;
					break;
				}
			}
			if (check1) {
				return new GenericResponse("Error: This user is not member of this subclub!");
			}
		} catch (Exception e) {
			System.out.println(e);
			return new GenericResponse("Error: Something is wrong!");
		}
		reportRepository.save(r);
		return new GenericResponse("Report is sent!");
	}

	@PostMapping("/viewreport")
	public ArrayList viewReport(@RequestBody JSONObject reportTypee, @CurrentUser User user) {

		Long reportType = Long.valueOf((Integer) reportTypee.get("reportType"));
		if (user.getIsSubClubAdmin() == -1 || user.getIsSubClubAdmin() == -2 || user.getIsSubClubAdmin() == -3) {
			ArrayList<String> list = new ArrayList<String>();
			list.add("You are not a subclub admin");
			return list;
		} else
			return reportRepository.findAllByReportTypeAndSubClubid(reportType, user.getIsSubClubAdmin());

	}

	@PostMapping("/evaluatereport")
	public GenericResponse evalueateReport(@RequestBody JSONObject json, @CurrentUser User user) {

		Long reportid = Long.valueOf((Integer) json.get("reportid"));
		boolean ban = (boolean) json.get("ban");

		if (ban == false) {
			reportRepository.deleteById(reportid);
			return new GenericResponse("Report Deleted");
		} else {
			Report r = reportRepository.findByreportid(reportid);
			banUser(r.getReported(), r.getSubClubid());
			reportRepository.deleteById(reportid);
			return new GenericResponse("User banned");
		}
	}

	private void banUser(String userName, Long subClubid) {
		if (banRepository.findByUserNameAndSubClubid(userName, subClubid) == null) {
			Ban newBan = new Ban(userName, subClubid);
			banRepository.save(newBan);
		}

		else {
			Ban b = banRepository.findByUserNameAndSubClubid(userName, subClubid);
			b.setBanNumber(b.getBanNumber() + 1);
			if (b.getBanNumber() == 3)
				b.setDismissed(true);
			else
				b.banIncrement();
			banRepository.save(b);
		}
	}

	public Boolean checkBanStatus(String userName, Long subClubid) {
		Ban b = banRepository.findByUserNameAndSubClubid(userName, subClubid);
		if (b == null) {
			return false;
		}
		return b.isActive();
	}

	@GetMapping("/mergen/admin/getsubclubadmins")
	public JSONArray getSubClubAdmins(@CurrentUser Admin admin){
		ArrayList<User> list = userRepository.findAllByisSubClubAdminGreaterThan((long)0);
		JSONArray list2 = new JSONArray();
		for(User u : list)
			list2.add(getSingleUser(u.getUserid()));
		return list2;
	}

	@PostMapping("/mergen/admin/bansubclubadmins")
	public GenericResponse banSubClubAdmins(@RequestBody JSONObject json, @CurrentUser Admin admin){

		if(!((Long.valueOf((Integer) json.get("banType")))==-1 || (Long.valueOf((Integer) json.get("banType")))==-3)) {
			return new GenericResponse("Error: You are a hacker!");
		}
		User u = userRepository.findByUserid(Long.valueOf((Integer) json.get("userid")));
		SubClub sc = subClubRepository.findBysubClubid(u.getIsSubClubAdmin());
		sc.setAdmin(null);
		sc.setAdminid(null);
		u.setIsSubClubAdmin(Long.valueOf((Integer) json.get("banType")));
		userRepository.save(u);
		subClubRepository.save(sc);
		return new GenericResponse("Successful: SubClub Admin Banned");
	}

	private JSONObject getSingleUser(Long userId){
		User user = userRepository.findByUserid(userId);
		JSONObject userJson = new JSONObject();

		userJson.put("id",user.getUserid());
		userJson.put("username",user.getUsername());
		
		SubClub sc = subClubRepository.findBysubClubid(user.getIsSubClubAdmin());
		userJson.put("subclubName",sc.getName());

		return userJson;
	}
}
