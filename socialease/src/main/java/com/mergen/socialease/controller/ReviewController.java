package com.mergen.socialease.controller;

import java.util.ArrayList;

import com.mergen.socialease.model.Club;
import com.mergen.socialease.model.User;
import com.mergen.socialease.model.Admin;
import com.mergen.socialease.model.Review;
import com.mergen.socialease.shared.CurrentUser;
import com.mergen.socialease.shared.GenericResponse;

import com.mergen.socialease.service.repository.ClubRepository;
import com.mergen.socialease.service.repository.UserRepository;
import com.mergen.socialease.service.repository.ReviewRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import com.mergen.socialease.shared.CurrentUser;

import net.bytebuddy.description.type.TypeDescription.Generic;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;


@RestController
public class ReviewController {

    @Autowired
    private ClubRepository clubRepository;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ReviewRepository reviewRepository;

    @PostMapping("/review")
    public GenericResponse review(@RequestBody Review review){
    	try {
    		if(reviewRepository.findByUserName(review.getUserName())!=null) {
    			return new GenericResponse("Error: You have already sent a review!");
    		}else {
    			reviewRepository.save(review);
    	        return new GenericResponse("Review Shared");
    		}
    	}catch(Exception e) {
    		return new GenericResponse("Error: Something is wrong!");
    	}
    }

    @GetMapping("/viewreviews")
    public ArrayList getReviews(@RequestParam Long clubid){
        return reviewRepository.findAllByClubid(clubid);
    }
    
    @GetMapping("/checkmyreview")
    public GenericResponse checkMyReview(@RequestParam String u) {
    	System.out.println(u);
    	try {
    		if(reviewRepository.findByUserName(u)!=null) {
    			return new GenericResponse("VAR");
    		}
    	}catch(Exception e) {
    		return new GenericResponse("YOK");
    	}
    	return new GenericResponse("YOK");
    }
}