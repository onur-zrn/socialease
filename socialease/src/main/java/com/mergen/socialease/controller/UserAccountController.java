package com.mergen.socialease.controller;

import java.util.Base64;
import java.util.Base64.Encoder;
import java.util.Base64.Decoder;
import java.util.Calendar;
import java.util.Date;
import java.util.Timer;
import java.util.TimerTask;
import java.io.IOException;
import java.util.ArrayList;

import javax.validation.Valid;

import org.json.simple.JSONObject;
import org.json.simple.JSONArray;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonView;
import com.fasterxml.jackson.databind.jsonFormatVisitors.JsonAnyFormatVisitor;
import com.fasterxml.jackson.databind.jsonFormatVisitors.JsonBooleanFormatVisitor;
import com.mergen.socialease.error.AuthException;
import com.mergen.socialease.error.ErrorResponse;
import com.mergen.socialease.model.ConfirmationToken;
import com.mergen.socialease.model.User;
import com.mergen.socialease.model.Creds;
import com.mergen.socialease.model.Admin;
import com.mergen.socialease.model.Club;
import com.mergen.socialease.model.SubClub;
import com.mergen.socialease.model.Question;
import com.mergen.socialease.model.Ban;
import com.mergen.socialease.model.ForgotToken;
import com.mergen.socialease.service.EmailSenderService;
import com.mergen.socialease.service.repository.ConfirmationTokenRepository;
import com.mergen.socialease.service.repository.UserRepository;
import com.mergen.socialease.service.repository.ClubRepository;
import com.mergen.socialease.service.repository.QuestionRepository;
import com.mergen.socialease.service.repository.SubClubRepository;
import com.mergen.socialease.service.repository.BanRepository;
import com.mergen.socialease.service.repository.ForgotTokenRepository;
import com.mergen.socialease.shared.CurrentUser;
import com.mergen.socialease.shared.GenericResponse;
import com.mergen.socialease.shared.Views;
import com.mergen.socialease.controller.SubClubController;
import org.springframework.web.multipart.MultipartFile;

import net.bytebuddy.description.type.TypeDescription.Generic;

import java.util.regex.Matcher;
import java.util.regex.Pattern;


@RestController
public class UserAccountController {
	@Autowired
	private UserRepository userRepository;

	@Autowired
	private ClubRepository clubRepository;

	@Autowired
	private SubClubRepository subClubRepository;
	
	@Autowired
	private ConfirmationTokenRepository confirmationTokenRepository;

	@Autowired
	private ForgotTokenRepository forgotTokenRepository;

	private BanRepository banRepository;

	
	
	@Autowired
	private EmailSenderService emailSenderService;
	
	PasswordEncoder passEncoder = new BCryptPasswordEncoder();
	
	@PostMapping("/register")
	public GenericResponse registerUser(@Valid @RequestBody User user)
	{
			user.setPassword(passEncoder.encode(user.getPassword()));
			user.setRegistered(false);
			user.setSurveyAnswered(false);
			user.setIsSubClubAdmin(-1);
			user.setBiographi("Write about yourself!");
			userRepository.save(user);
			
			ConfirmationToken confirmationToken = new ConfirmationToken(user);
			
			confirmationTokenRepository.save(confirmationToken);
			
			SimpleMailMessage mailMessage = new SimpleMailMessage();
			mailMessage.setTo(user.getEmail());
			mailMessage.setSubject("Complete Registration!");
			mailMessage.setFrom("chand312902@gmail.com");
			mailMessage.setText("To confirm your account, please click here : "
			+"http://localhost:3000/#/confirm?token="+confirmationToken.getConfirmationToken());
			
			emailSenderService.sendEmail(mailMessage);
			
			return new GenericResponse(user.getEmail()+" is added!");
	}
	
	@PostMapping("/auth")
	@JsonView(Views.Base.class)
	public ResponseEntity<?> login(@CurrentUser User user){
		return ResponseEntity.ok(user);
	}
	
	@RequestMapping(value="/confirm", method= {RequestMethod.GET, RequestMethod.POST})
	public GenericResponse confirmUserAccount(@RequestParam("token")String confirmationToken)
	{
		System.out.println(confirmationToken);
		ConfirmationToken token = confirmationTokenRepository.findByConfirmationToken(confirmationToken);

		User user = userRepository.findByEmail(token.getUser().getEmail());
		user.setRegistered(true);
		userRepository.save(user);
		confirmationTokenRepository.delete(token);
		return new GenericResponse("Activation is successful! You can login with your username and password.");
	}

	@PostMapping("/forgot")
	public GenericResponse forgot(@RequestBody JSONObject json){
		String email =  (String) json.get("email");
		User u = userRepository.findByEmail(email);
		if (u== null)
			return new GenericResponse("Error: Something is wrong!");

		ForgotToken forgotToken = new ForgotToken(u);
		forgotTokenRepository.save(forgotToken);
		
		
		SimpleMailMessage mailMessage = new SimpleMailMessage();
		mailMessage.setTo(u.getEmail());
		mailMessage.setSubject("Password Recovery");
		mailMessage.setFrom("chand312902@gmail.com");
		mailMessage.setText("http://localhost:3000/#/recover?token=" + forgotToken.getForgotToken());
		emailSenderService.sendEmail(mailMessage);
		return new GenericResponse("Please check your e-mail");
	}

	@PostMapping("/recover")
	public GenericResponse recover(@RequestParam String token,@Valid @RequestBody Creds creds){
		
		ForgotToken forgotToken = forgotTokenRepository.findByforgotToken(token);
		Long userid = forgotToken.getUser().getUserid();
		User u = userRepository.findByUserid(userid);
		if (u==null)
			throw new Error();
		String newPassword = creds.getPassword();
		u.setPassword(passEncoder.encode(newPassword));
		userRepository.save(u);
		forgotTokenRepository.delete(forgotToken);
		return new GenericResponse("Password Changed");
	}

	//EĞER USER O CLUB'A VEYA SUBCLUB'A ÜYE DEĞİLSE, HATA VERECEK!
	@GetMapping("/getuserwithmode")
	public JSONArray getUser(@RequestParam Long mode, Long id,@CurrentUser User user){
		if(id<0)
			throw new Error();
		if(mode == 1){
			if (!isUserMember(user.getClubList(), id)){
				JSONArray Json = new JSONArray();
				Json.add("Error: This user is not a member of this club.");
				return Json;
			}
			return getClubUsers(id);
		}
		else if(mode == 2){
			if (!isUserMember(user.getSubClubList(), id)){
				JSONArray Json = new JSONArray();
				Json.add("Error: This user is not a member of this subclub.");
				return Json;
			}
			return getSubClubUsers(id);
		}		
		else
			throw new Error();
	}

	private boolean isUserMember(String list, long id){
		if (list == null)
		return false;
		for (String st : list.split(",")){
			String s = st.split("-")[0];
			Integer ID;
			if (s.charAt(0) == '[')
				ID = Integer.parseInt(s.substring(1));
			else 
				ID = Integer.parseInt(s);

			if (ID == id)
				return true;
		}
		return false;
	}
	
	@GetMapping("/getnameofthesubclub")
	public JSONObject getNameOfTheSubClub(@RequestParam Long id, @CurrentUser User user) {
		JSONObject json = new JSONObject();
		try {
			json.put("nameOfSubClub", subClubRepository.findBysubClubid(id).getName());
		}
		catch(Exception e) {}
		return json;
	}

	@GetMapping("/getnameoftheclub")
	public JSONObject getNameOfTheClub(@RequestParam Long id, @CurrentUser User user) {
		JSONObject json = new JSONObject();
		try {
			json.put("nameOfClub", clubRepository.findByclubid(id).getClubName());
		}
		catch(Exception e) {}
		return json;
	}
	
	@GetMapping("mergen/admin/getuserwithmode")
	public JSONArray getUserForAdmin(@RequestParam Long mode, Long id, @CurrentUser Admin admin){
		if(id<0)
			throw new Error();
		if(mode == 1)
			return getClubUsers(id);
		else if(mode == 2)
			return getSubClubUsers(id);
		else if(mode == 3)
			return getAllUsers();
		else
			throw new Error();
	}

	private JSONObject getSingleUser(Long userId){
		User user = userRepository.findByUserid(userId);
		JSONObject userJson = new JSONObject();

		userJson.put("id",user.getUserid());
		userJson.put("username",user.getUsername());

		return userJson;
	}

	private JSONArray getAllUsers(){
		JSONArray allUsers = new JSONArray();

		try {
			for(User u : userRepository.findAll()){
				allUsers.add(getSingleUser(u.getUserid()));
			}
		}catch(Exception e) {
		}

		return allUsers;
	}

	private JSONArray getClubUsers(Long clubId){
		JSONArray clubUsers = new JSONArray();
		Club c = clubRepository.findByclubid(clubId);

		try {
			for(String s : c.getUserList().split(","))
				clubUsers.add(getSingleUser(Long.parseLong(s)));
		}catch(Exception e) {

		}
		
		return clubUsers;
	}
	
	private JSONArray getSubClubUsers(Long subClubId){

		JSONArray subClubUsers = new JSONArray();
		SubClub sc = subClubRepository.findBysubClubid(subClubId);

		try {
			for(String s : sc.getUserList().split(","))
				subClubUsers.add(getSingleUser(Long.parseLong(s)));
		}catch(Exception e) {

		}
		
		return subClubUsers;

	}

	//EĞER CURRENT USER İLE, ARADIĞI USER'IN ORTAK HİÇBİR KULÜBÜ YOKSA HATA VERECEK!
	@PostMapping("/getuserdetails")
	public JSONObject getUserDetails(@RequestBody JSONObject usernameee,@CurrentUser User currentUser){
		String username = (String) usernameee.get("username");
		JSONObject userJson = new JSONObject();

		User user1 = userRepository.findByUsername(username);

		if (!checkCommonClubs(user1, currentUser)){
			userJson.put("error", "Error: Users do not have any clubs in common");
			return userJson;
		}
		
		String uname=username;
		if(uname.charAt(uname.length()-1)=='=') {
			uname=uname.substring(0, uname.length()-1);
		}
		User u = userRepository.findByUsername(uname);
		
		if(u==null) {
			userJson.put("error", "Error: There is no user with this username!");
			return userJson;
		}
		
		userJson.put("userId",u.getUserid());
		userJson.put("username",u.getUsername());
		userJson.put("displayName",u.getDisplayName());
		userJson.put("email",u.getEmail());
		userJson.put("isSCAdmin", u.getIsSubClubAdmin());
		userJson.put("image", u.getImage());
		userJson.put("isThereNewClub", u.isThereNewClub());
		userJson.put("biographi", u.getBiographi());
		userJson.put("postCount", u.getTotalPostCount());
		JSONArray clubJson = new JSONArray();
		if(u.getClubList()==null || u.getClubList().equals("")) {
			clubJson=null;
		}
		else {
			for(String s : u.getClubList().split(",")){
				Club c = clubRepository.findByclubid(Long.parseLong(s));

				JSONObject newClub = new JSONObject();
				newClub.put("clubId", c.getClubid());
				newClub.put("clubName", c.getClubName());
				clubJson.add(newClub);
			}
		}
		
		
		JSONArray subClubJson = new JSONArray();
		if(u.getSubClubList()==null || u.getSubClubList().equals("")) {
			subClubJson=null;
		}
		else {
			for (String s : u.getSubClubList().split(",")) {
				String s2 = s.substring(1, s.length()-1);
				String[] temp=s2.split("-");
				SubClub subclub = subClubRepository.findBysubClubid(Long.parseLong(temp[0]));
				
				JSONObject subclubjsonobject = new JSONObject();
				subclubjsonobject.put("subClubid", subclub.getSubClubid());
				subclubjsonobject.put("subClubName", subclub.getName());
				subclubjsonobject.put("admin", subclub.getAdminid());
				subclubjsonobject.put("clubId",subclub.getClubid());
				subClubJson.add(subclubjsonobject);
			}
		}
		
		userJson.put("clubs",clubJson);
		userJson.put("subclubs", subClubJson);
		userJson.put("error", "NO");
		return userJson;
	}
	
	private boolean checkCommonClubs(User user1, User user2){
		
		if (user1.getClubList()==null || user2.getClubList()==null)
			return false;

		for(String st : user1.getClubList().split(","))
			if (isUserMember(user2.getClubList(), Long.parseLong(st)))
				return true;

		return false;
	}
	
	@PostMapping("/saveuserimage")
	public GenericResponse  saveUserImage(@RequestBody JSONObject json, @CurrentUser User user)
	{
		long userid = Long.valueOf((Integer) json.get("id"));
		if(userid!=user.getUserid()) {
			return new GenericResponse("Error: you are a hacker");
		}
		else {
			try {
				String base64Image = (String) json.get("file");
				String dataType = base64Image.split(";")[0];
				if (!("data:image/png".equals(dataType) || "data:image/jpeg".equals(dataType) || "data:image/jpg".equals(dataType)) ) {
					return new GenericResponse("Error: Image format can be jpg, jpeg or png!");			     			
				}
				else {
					user.setImage(base64Image);
					userRepository.save(user);
					return new GenericResponse("Profile picture updated");
				}
			}
			catch(Exception e) {
				return new GenericResponse("Error: Something is wrong!");
			}
		}
	}

	@PostMapping("/deleteuserimage")
	public GenericResponse deleteUserImage(@CurrentUser User user)
	{					
		if (user.getImage()==null) {
				return new GenericResponse("Warning: you don't have a profile picture already!");
		}
		else {
			user.setImage(null);
			userRepository.save(user);
			return new GenericResponse("Profile picture deleted");
		}
	}
	//@RequestBody String newDisplayName,@PathVariable String username, @CurrentUser User loggedInUser
	@PostMapping("/updateuser/{usernamee}")
	@PreAuthorize("#usernamee==#user.username")
	public GenericResponse updateUserProfile(@RequestBody JSONObject json,@PathVariable String usernamee, @CurrentUser User user)
	{	
		String username =  (String) json.get("username");
		String displayname =  (String) json.get("displayname");
		String biographi =  (String) json.get("biographi");
		String password =  (String) json.get("password");
		
		Boolean dncontrol = true;		
		Boolean uncontrol = true;		
		Boolean bcontrol = true;		
		Boolean pcontrol = true;		
				
		//changes checked
		
		if(displayname == null || displayname.equals("")||displayname.equals(user.getDisplayName())) {
			dncontrol=false;
		}
		if(username == null || username.equals("")||username.equals(user.getUsername())) {
			uncontrol = false;
		}
		if(biographi==null || biographi.equals("")|| biographi.equals(user.getBiographi())) {
			bcontrol = false;
		}
		if(password == null || password.equals("") 
				|| user.getPassword().equals(passEncoder.encode(password))) {
			pcontrol = false;	
		}
				
		if(dncontrol==false && uncontrol== false && bcontrol==false && pcontrol==false)
		{
        	return new GenericResponse("Warning: No changes were detected");
		}   
		

		//display name
        if(dncontrol==true && displayname.length() <5)
        {
        	return new GenericResponse("Warning: Invalid display name. Display Name must contain at least 5 characters");
        }
        else if(dncontrol==true && displayname.length()>255)
        {
        	return new GenericResponse("Warning: Invalid display name. Display Name must contain  maximum 255 characters");
        }
        else if(dncontrol==true) {
        	user.setDisplayName(displayname);
        }
        
        //biographi
        if(bcontrol==true && biographi.length() <5 )
        {
        	return new GenericResponse("Warning: Invalid biographi. Biographi must contain at least 5 characters");
        }
        else if(bcontrol==true && biographi.length()>255)
        {
        	return new GenericResponse("Warning: Invalid biographi. Biographi must contain  maximum 255 characters");
        }
        else if(bcontrol==true) {
        	user.setBiographi(biographi);
        }
      
        //username
        if(uncontrol==true && username.length() <5 )
        {
        	return new GenericResponse("Warning: Invalid username. Username must contain at least 5 characters");
        }
        else if(uncontrol==true && username.length()>255)
        {
        	return new GenericResponse("Warning: Invalid username. Username must contain  maximum 255 characters");
        }
        if(uncontrol==true && !user.getUsername().equals(username)){
			for (User u : userRepository.findAll()) {
				String uname =u.getUsername();
				if(username.equals(uname))
		        	return new GenericResponse("Warning: Username already exists");
			}
        }               
        
        String regexusername= "[a-zA-Z\\.0-9]*";
        if(uncontrol==true && !Pattern.matches(regexusername,username))
        	return new GenericResponse("Warning: Username can only contain uppercase letters, lowercase letters, numbers or '.' character.");
        if(uncontrol==true) {
        	user.setUsername(username);
        }
        
        //password
        

        if(pcontrol==true && password.length() <5 )
        {
        	return new GenericResponse("Warning: Invalid password. Password must contain at least 5 characters");
        }
        else if(pcontrol==true && password.length()>255)
        {
        	return new GenericResponse("Warning: Invalid password. Password must contain  maximum 255 characters");
        }
        
        String regexpassword= "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$";
        
        if(pcontrol==true && !Pattern.matches(regexpassword,password))
        	return new GenericResponse("Warning: The password must contain at least one uppercase letter, one lowercase letter and one number.");
        
        String regexpassword2= "[^:\\s]*";
        
        if(pcontrol==true && !Pattern.matches(regexpassword2,password))
        	return new GenericResponse("Password must not contain space and ':' characters.");
        
        if(pcontrol==true)
        {
        	user.setPassword((passEncoder.encode(password)));
        }
        
        userRepository.save(user);
        
        
    	return new GenericResponse("Success: Profile updated");
	}
}
