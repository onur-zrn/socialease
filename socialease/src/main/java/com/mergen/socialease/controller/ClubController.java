package com.mergen.socialease.controller;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mergen.socialease.model.Admin;
import com.mergen.socialease.model.Club;
import com.mergen.socialease.model.Question;
import com.mergen.socialease.model.SubClub;
import com.mergen.socialease.model.SubClubAdminRequest;
import com.mergen.socialease.model.User;
import com.mergen.socialease.req_classes.SurveyAnswers;
import com.mergen.socialease.req_classes.SurveyAnswersWithUserId;
import com.mergen.socialease.req_classes.SurveyQuestion;
import com.mergen.socialease.service.repository.ClubRepository;
import com.mergen.socialease.service.repository.QuestionRepository;
import com.mergen.socialease.service.repository.SubClubAdminRequestRepository;
import com.mergen.socialease.service.repository.SubClubRepository;
import com.mergen.socialease.service.repository.UserRepository;
import com.mergen.socialease.shared.CurrentUser;
import com.mergen.socialease.shared.GenericResponse;

@RestController
public class ClubController {
	@Autowired
	private ClubRepository clubRepository;

	@Autowired
	private SubClubRepository subClubRepository;

	@Autowired
	private QuestionRepository questionRepository;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private SubClubAdminRequestRepository subClubAdminRequestRepository;

	@SuppressWarnings("unchecked")
	@RequestMapping(value = { "/getclubs", "/mergen/admin/getclubs" })
	public JSONArray getClubs() {
		JSONArray clubList = new JSONArray();

		for (Club c : clubRepository.findAll()) {
			JSONObject newClub = new JSONObject();
			newClub.put("id", c.getClubid());
			newClub.put("name", c.getClubName());
			JSONArray subClubList = new JSONArray();

			for (String s : c.getSubClubList().split(",")) {
				SubClub subclub = subClubRepository.findBysubClubid(Integer.parseInt(s));
				JSONObject subclubjson = new JSONObject();
				subclubjson.put("id", subclub.getSubClubid());
				subclubjson.put("name", subclub.getName());
				if(subclub.getAdminid()!=null) {
					User adminOfSubClub = userRepository.findByUserid(subclub.getAdminid());
					subclubjson.put("admin", adminOfSubClub.getUsername());
				}
				else {
					subclubjson.put("admin", null);
				}

				subClubList.add(subclubjson);
			}
			newClub.put("subClubList", subClubList);

			JSONArray questionArray = new JSONArray();

			for (String st : c.getQuestionList().split(",")) {
				Question question = questionRepository.findByquestionid(Integer.parseInt(st));
				JSONObject questionJ = new JSONObject();
				questionJ.put("id", question.getQuestionid());
				questionJ.put("question", question.getQuestion());
				try {
					if (question.getSubClubid() == -1) {
						questionJ.put("subClubName", "General");
					}

					else {
						questionJ.put("subClubName",
								subClubRepository.findBysubClubid(question.getSubClubid()).getName());
					}
				} catch (Exception e) {
					questionJ.put("subClubName", "General");
				}

				questionJ.put("coefficient", question.getCoefficient());
				questionArray.add(questionJ);
			}
			newClub.put("questionList", questionArray);

			clubList.add(newClub);

		}
		return clubList;

	}

	@SuppressWarnings("unchecked")
	@RequestMapping("/getnewclubs")
	public JSONArray getNewClubs(@CurrentUser User user) {
		JSONArray clubList = new JSONArray();
		if ((user.isSurveyAnswered() == true && user.isThereNewClub() == true)) {
			String userexistclubs = user.getClubList();
			String userclubs = user.getNewClubList();
			String usersubclubs = user.getNewSubClubList();

			boolean isThereNewC = false;
			boolean isThereNewSC = false;

			String[] existclublist = null;
			String[] newclublist = null;
			String[] newsubclublist = null;

			try {
				existclublist = userexistclubs.split(",");
			} catch (Exception e) {
				existclublist[0] = userexistclubs;
			}

			if (userclubs != null) {
				try {
					newclublist = userclubs.split(",");
				} catch (Exception e) {
					newclublist[0] = userclubs;
				}
				isThereNewC = true;
			}

			if (usersubclubs != null) {
				try {
					newsubclublist = usersubclubs.split(",");
				} catch (Exception e) {
					newsubclublist[0] = usersubclubs;
				}
				isThereNewSC = true;
			}

			List<String> usernewclub = null;
			List<String> usernewsubclub = null;
			List<String> existingclub = null;

			if (isThereNewC)
				usernewclub = Arrays.asList(newclublist);
			if (isThereNewSC)
				usernewsubclub = Arrays.asList(newsubclublist);
			existingclub = Arrays.asList(existclublist);
			if (isThereNewC && isThereNewSC) {
				for (Club c : clubRepository.findAll()) {
					int check = 0;
					String subclubid = null;
					for (int i = 0; i < usernewsubclub.size(); i++) {
						subclubid = usernewsubclub.get(i);
						SubClub sc = subClubRepository.findBysubClubid(Long.parseLong(subclubid));
						Long club_id = sc.getClubid();
						if (club_id == c.getClubid() && existingclub.contains(Long.toString(c.getClubid()))) {
							check = 1;
							break;
						}
					}
					if (check == 1 || usernewclub.contains(Long.toString(c.getClubid()))) {
						JSONObject newClub = new JSONObject();
						newClub.put("id", c.getClubid());
						newClub.put("name", c.getClubName());
						JSONArray subClubList = new JSONArray();
						if (check == 1) {
							for (String s : c.getSubClubList().split(",")) {
								SubClub subclub = subClubRepository.findBysubClubid(Integer.parseInt(s));
								if (usernewsubclub.contains(s)) {
									JSONObject subclubjson = new JSONObject();
									subclubjson.put("id", subclub.getSubClubid());
									subclubjson.put("name", subclub.getName());
									subClubList.add(subclubjson);
								}
							}
							newClub.put("subClubList", subClubList);

							JSONArray questionArray = new JSONArray();

							for (String st : c.getQuestionList().split(",")) {
								Question question = questionRepository.findByquestionid(Integer.parseInt(st));
								String subclub_id = Long.toString(question.getSubClubid());
								if (usernewsubclub.contains(subclub_id)) {
									JSONObject questionJ = new JSONObject();
									questionJ.put("id", question.getQuestionid());
									questionJ.put("question", question.getQuestion());
									questionJ.put("subClubName",
											subClubRepository.findBysubClubid(question.getSubClubid()).getName());

									questionJ.put("coefficient", question.getCoefficient());
									questionArray.add(questionJ);
								}
							}
							newClub.put("questionList", questionArray);

						} else {
							for (String s : c.getSubClubList().split(",")) {
								SubClub subclub = subClubRepository.findBysubClubid(Integer.parseInt(s));
								JSONObject subclubjson = new JSONObject();
								subclubjson.put("id", subclub.getSubClubid());
								subclubjson.put("name", subclub.getName());
								subClubList.add(subclubjson);
							}
							newClub.put("subClubList", subClubList);

							JSONArray questionArray = new JSONArray();

							for (String st : c.getQuestionList().split(",")) {
								Question question = questionRepository.findByquestionid(Integer.parseInt(st));
								JSONObject questionJ = new JSONObject();
								questionJ.put("id", question.getQuestionid());
								questionJ.put("question", question.getQuestion());
								try {
									if (question.getSubClubid() == -1) {
										questionJ.put("subClubName", "General");
									}

									else {
										questionJ.put("subClubName",
												subClubRepository.findBysubClubid(question.getSubClubid()).getName());
									}
								} catch (Exception e) {
									questionJ.put("subClubName", "General");
								}

								questionJ.put("coefficient", question.getCoefficient());
								questionArray.add(questionJ);
							}
							newClub.put("questionList", questionArray);
						}

						clubList.add(newClub);

					}
				}
			} else {
				if (isThereNewSC) {
					for (Club c : clubRepository.findAll()) {
						int check = 0;
						String subclubid = null;
						for (int i = 0; i < usernewsubclub.size(); i++) {
							subclubid = usernewsubclub.get(i);
							SubClub sc = subClubRepository.findBysubClubid(Long.parseLong(subclubid));
							Long club_id = sc.getClubid();
							if (club_id == c.getClubid() && existingclub.contains(Long.toString(c.getClubid()))) {
								check = 1;
								break;
							}
						}
						if (check == 1) {
							JSONObject newClub = new JSONObject();
							newClub.put("id", c.getClubid());
							newClub.put("name", c.getClubName());
							JSONArray subClubList = new JSONArray();

							for (String s : c.getSubClubList().split(",")) {
								SubClub subclub = subClubRepository.findBysubClubid(Integer.parseInt(s));
								if (usernewsubclub.contains(s)) {
									JSONObject subclubjson = new JSONObject();
									subclubjson.put("id", subclub.getSubClubid());
									subclubjson.put("name", subclub.getName());
									subClubList.add(subclubjson);
								}
							}
							newClub.put("subClubList", subClubList);

							JSONArray questionArray = new JSONArray();

							for (String st : c.getQuestionList().split(",")) {
								Question question = questionRepository.findByquestionid(Integer.parseInt(st));
								String subclub_id = Long.toString(question.getSubClubid());
								if (usernewsubclub.contains(subclub_id)) {
									JSONObject questionJ = new JSONObject();
									questionJ.put("id", question.getQuestionid());
									questionJ.put("question", question.getQuestion());
									questionJ.put("subClubName",
											subClubRepository.findBysubClubid(question.getSubClubid()).getName());

									questionJ.put("coefficient", question.getCoefficient());
									questionArray.add(questionJ);
								}
							}
							newClub.put("questionList", questionArray);
							clubList.add(newClub);
						}
					}
				} else if (isThereNewC) {
					for (Club c : clubRepository.findAll()) {
						if (usernewclub.contains(Long.toString(c.getClubid()))) {
							JSONObject newClub = new JSONObject();
							newClub.put("id", c.getClubid());
							newClub.put("name", c.getClubName());
							JSONArray subClubList = new JSONArray();
							for (String s : c.getSubClubList().split(",")) {
								SubClub subclub = subClubRepository.findBysubClubid(Integer.parseInt(s));
								JSONObject subclubjson = new JSONObject();
								subclubjson.put("id", subclub.getSubClubid());
								subclubjson.put("name", subclub.getName());
								subClubList.add(subclubjson);
							}
							newClub.put("subClubList", subClubList);

							JSONArray questionArray = new JSONArray();

							for (String st : c.getQuestionList().split(",")) {
								Question question = questionRepository.findByquestionid(Integer.parseInt(st));
								JSONObject questionJ = new JSONObject();
								questionJ.put("id", question.getQuestionid());
								questionJ.put("question", question.getQuestion());
								try {
									if (question.getSubClubid() == -1) {
										questionJ.put("subClubName", "General");
									}

									else {
										questionJ.put("subClubName",
												subClubRepository.findBysubClubid(question.getSubClubid()).getName());
									}
								} catch (Exception e) {
									questionJ.put("subClubName", "General");
								}

								questionJ.put("coefficient", question.getCoefficient());
								questionArray.add(questionJ);
							}
							newClub.put("questionList", questionArray);
							clubList.add(newClub);
						}
					}
				}
			}

		}

		return clubList;
	}

	@SuppressWarnings("unchecked")
	@RequestMapping(value = { "/getspecclub", "/mergen/admin/getspecclub" })
	public JSONObject getSpecClub(@RequestBody JSONObject clubId) {

		String id = (String) clubId.get("id");
		long longId = Long.parseLong(id);
		Club club = clubRepository.findByclubid(longId);

		JSONObject newClub = new JSONObject();
		newClub.put("id", club.getClubid());
		newClub.put("name", club.getClubName());

		JSONArray subClubList = new JSONArray();
		for (String s : club.getSubClubList().split(",")) {
			SubClub subclub = subClubRepository.findBysubClubid(Integer.parseInt(s));
			JSONObject subclubjson = new JSONObject();
			subclubjson.put("id", subclub.getSubClubid());
			subclubjson.put("name", subclub.getName());
			subclubjson.put("admin", subclub.getAdmin());

			subClubList.add(subclubjson);
		}
		newClub.put("subClubList", subClubList);

		JSONArray questionArray = new JSONArray();

		for (String st : club.getQuestionList().split(",")) {
			Question question = questionRepository.findByquestionid(Integer.parseInt(st));
			JSONObject questionJ = new JSONObject();
			questionJ.put("id", question.getQuestionid());
			questionJ.put("question", question.getQuestion());
			try {
				if (question.getSubClubid() == -1) {
					questionJ.put("subClubName", "General");
				}

				else {
					SubClub tempSC = subClubRepository.findBysubClubid(question.getSubClubid());
					questionJ.put("subClubName", tempSC.getName());
				}
			} catch (Exception e) {
				questionJ.put("subClubName", "General");
			}

			questionJ.put("coefficient", question.getCoefficient());
			questionArray.add(questionJ);
		}
		newClub.put("questionList", questionArray);
		return newClub;

	}

	@PostMapping("/mergen/admin/saveclub")
	public GenericResponse saveClub(@RequestBody JSONObject json) {
		String clubName = (String) json.get("name");
		if (clubName == null || clubName.length() == 0) {
			return new GenericResponse("Error: Something is wrong!");
		}
		if (clubRepository.findByClubName(clubName) != null) {
			return new GenericResponse("Error: There is already a club named by this!");
		}

		ArrayList<JSONObject> subClubs = (ArrayList) json.get("subClubList");
		ArrayList<JSONObject> questions = (ArrayList) json.get("questionList");
		if (subClubs.size() == 0 || questions.size() == 0) {
			return new GenericResponse("Error: You must add sub-clubs/questions!");
		}

		String subClubList = "";
		String questionList = "";

		List<String> checkForUnique = new ArrayList<String>();
		for (int i = 0; i < subClubs.size(); i++) {
			Map subclub = subClubs.get(i);
			String name = (String) subclub.get("name");
			if (name == null || name.length() == 0 || name.equals("General")) {
				return new GenericResponse("Error: Invalid subclub names!");
			}
			if (subClubRepository.findByName(name) != null) {
				return new GenericResponse("Error: You must add unique named subclubs!");
			}
			if (checkForUnique.size() == 0) {
				checkForUnique.add(name);
			} else {
				if (checkForUnique.contains(name)) {
					return new GenericResponse("Error: You must add unique named subclubs!");
				} else {
					checkForUnique.add(name);
				}
			}
		}

		for (int i = 0; i < questions.size(); i++) {
			Map q = questions.get(i);
			String question = (String) q.get("question");
			if (question == null || question.length() == 0) {
				return new GenericResponse("Error: Invalid questions!");
			}
		}

		Club newClub = new Club();
		newClub.setClubName(clubName);
		clubRepository.save(newClub);

		for (int i = 0; i < subClubs.size(); i++) {
			Map subclub = subClubs.get(i);
			SubClub newSC = new SubClub();
			newSC.setName((String) subclub.get("name"));
			newSC.setClubid(newClub.getClubid());
			newSC.setAdmin(null);
			subClubRepository.save(newSC);
			subClubList = subClubList + newSC.getSubClubid();
			if (i != subClubs.size() - 1) {
				subClubList = subClubList + ",";
			}
		}

		for (int i = 0; i < questions.size(); i++) {
			Map q = questions.get(i);
			Question newQ = new Question();
			newQ.setQuestion((String) q.get("question"));
			float cof = Float.parseFloat((String) q.get("coefficient"));
			if (cof < 1) {
				newQ.setCoefficient(1);
			} else if (cof > 10) {
				newQ.setCoefficient(10);
			} else {
				newQ.setCoefficient(cof);
			}
			if (((String) q.get("subClubName")).equals("General")) {
				newQ.setSubClubid(-1);
			} else {
				try {
					long SCID = (subClubRepository.findByName((String) q.get("subClubName"))).getSubClubid();
					newQ.setSubClubid(SCID);
				} catch (Exception e) {
					newQ.setSubClubid(-1);
				}

			}
			newQ.setClubid(newClub.getClubid());
			questionRepository.save(newQ);
			questionList = questionList + newQ.getQuestionid();
			if (i != questions.size() - 1) {
				questionList = questionList + ",";
			}

		}

		newClub.setSubClubList(subClubList);
		newClub.setQuestionList(questionList);
		clubRepository.save(newClub);

		// new club add to user newclublist
		for (User user : userRepository.findAll()) {
			String clubid = Long.toString(newClub.getClubid());
			if (user.isSurveyAnswered() == true) {
				user.setIsThereNewClub(true);
				if (user.getNewClubList() == null || user.getNewClubList().equals("")) {
					user.setNewClubList(clubid);
				} else {
					user.setNewClubList(user.getNewClubList() + "," + clubid);
				}
			}
			userRepository.save(user);
		}

		return new GenericResponse("New club is added!");
	}

	@PostMapping("/mergen/admin/deleteclub")
	public GenericResponse deleteClub(@RequestBody JSONObject deletedClub) {
		String clubName = (String) deletedClub.get("name");
		Club club = clubRepository.findByClubName(clubName);
		long deletedId = club.getClubid();
		String deletedSubClubList = club.getSubClubList();
		String deletedQuestions = club.getQuestionList();
		String userListInClub = club.getUserList();
		String userListInSubClub;
		try {
			clubRepository.deleteById(deletedId);
			// delete club from newclublist
			for (User user : userRepository.findAll()) {
				String usernewclubs = user.getNewClubList();

				if (user.isSurveyAnswered() == true && user.isThereNewClub()) {
					Boolean checkcontains = checkContainStringList(usernewclubs,  Long.toString(deletedId));
					if(checkcontains) {
						String newclublist = removeFromStringList(usernewclubs, Long.toString(deletedId));
						user.setNewClubList(newclublist);
						if (newclublist==null && user.getNewSubClubList()==null)
							user.setIsThereNewClub(false);
					}
				}
				userRepository.save(user);
			}
		} catch (Exception e) {
			return new GenericResponse("Error: Something is wrong!");
		}
		if (!(userListInClub == null || userListInClub.equals(""))) {
			for (String userId : userListInClub.split(",")) {
				User newUser = userRepository.findByUserid(Long.parseLong(userId));
				String[] CIDfromUser = newUser.getClubList().split(",");
				List<String> CIDfromUser2 = new ArrayList<String>(Arrays.asList(CIDfromUser));
				if (CIDfromUser2.contains(Long.toString(deletedId))) {
					CIDfromUser2.remove(Long.toString(deletedId));
				}
				if (CIDfromUser2.size() == 0) {
					newUser.setSurveyAnswered(false);
					newUser.setClubList(null);
				} else {
					String str = String.join(",", CIDfromUser2);
					newUser.setClubList(str);
				}
				userRepository.save(newUser);
			}
		}
		for (String id : deletedSubClubList.split(",")) {
			try {
				userListInSubClub = subClubRepository.findBysubClubid(Long.parseLong(id)).getUserList();
				subClubRepository.deleteById(Long.parseLong(id));
				if (!(userListInSubClub == null || userListInSubClub.equals(""))) {
					for (String userId : userListInSubClub.split(",")) {
						User newUser = userRepository.findByUserid(Long.parseLong(userId));
						String[] SCIDfromUser = newUser.getSubClubList().split(",");
						List<String> SCIDfromUser2 = new ArrayList<String>(Arrays.asList(SCIDfromUser));
						for (int k = 0; k < SCIDfromUser2.size(); k++) {
							String temp = SCIDfromUser2.get(k).substring(1, SCIDfromUser2.get(k).length() - 1);
							String[] temp2 = temp.split("-");
							if (temp2[0].equals(id)) {
								SCIDfromUser2.remove(k);
								break;
							}
						}
						if (SCIDfromUser2.size() == 0) {
							newUser.setSubClubList(null);
						} else {
							String str = String.join(",", SCIDfromUser2);
							newUser.setSubClubList(str);
						}
						userRepository.save(newUser);
					}
				}
			} catch (Exception e) {
				return new GenericResponse("Error: Something is wrong!");
			}
		}
		for (String id : deletedQuestions.split(",")) {
			try {
				questionRepository.deleteById(Long.parseLong(id));
			} catch (Exception e) {
				return new GenericResponse("Error: Something is wrong!");
			}
		}
		return new GenericResponse("Club is deleted!");
	}

	@SuppressWarnings("unchecked")
	@PutMapping("/mergen/admin/updateclub")
	public GenericResponse updateClub(@RequestBody JSONObject json) {

		boolean isChanged = false;

		String clubId = (String) json.get("id");
		Club updatedClub = clubRepository.findByclubid(Long.parseLong(clubId));

		if (!updatedClub.getClubName().equals((String) json.get("name"))) {
			String newName = (String) json.get("name");
			if (newName == null || newName.length() == 0) {
				return new GenericResponse("Error: Something is wrong!");
			} else {
				if (clubRepository.findByClubName(newName) != null) {
					return new GenericResponse("Error: There is already a club named by " + newName + "!");
				}
				updatedClub.setClubName(newName);
				isChanged = true;
			}
		}

		ArrayList<JSONObject> addSC = (ArrayList) json.get("addSC");
		ArrayList<JSONObject> addQ = (ArrayList) json.get("addQ");
		ArrayList<JSONObject> delSC = (ArrayList) json.get("delSC");
		ArrayList<JSONObject> delQ = (ArrayList) json.get("delQ");
		if (addSC.size() == 0 && addQ.size() == 0 && delSC.size() == 0 && delQ.size() == 0) {
			if (isChanged) {
				clubRepository.save(updatedClub);
				return new GenericResponse("Club is updated!");
			} else {
				return new GenericResponse("Warning: There is no change!");
			}
		}

		if (delSC.size() >= updatedClub.getSubClubList().split(",").length) {
			return new GenericResponse("Error: You cannot delete all subclubs!");
		}
		if (delQ.size() >= updatedClub.getQuestionList().split(",").length) {
			return new GenericResponse("Error: You cannot delete all questions!");
		}

		String deletedSC = "";

		if (delSC.size() != 0) {
			List<String> checkTheseUsers = new ArrayList<String>();
			String[] scIdfromC = updatedClub.getSubClubList().split(",");
			List<String> scIdfromC2 = new ArrayList<String>(Arrays.asList(scIdfromC));
			isChanged = true;
			for (int i = 0; i < delSC.size(); i++) {
				Map sc = delSC.get(i);
				Long scId = ((Number) sc.get("id")).longValue();
				if (subClubRepository.findBysubClubid(scId) == null) {
					continue;
				}
				String userListInSubClub = subClubRepository.findBysubClubid(scId).getUserList();
				if (!(userListInSubClub == null || userListInSubClub.equals(""))) {
					for (String userId : userListInSubClub.split(",")) {
						if (!checkTheseUsers.contains(userId)) {
							checkTheseUsers.add(userId);
						}
						User newUser = userRepository.findByUserid(Long.parseLong(userId));
						String[] SCIDfromUser = newUser.getSubClubList().split(",");
						List<String> SCIDfromUser2 = new ArrayList<String>(Arrays.asList(SCIDfromUser));
						for (int k = 0; k < SCIDfromUser2.size(); k++) {
							String temp = SCIDfromUser2.get(k).substring(1, SCIDfromUser2.get(k).length() - 1);
							String[] temp2 = temp.split("-");
							if (temp2[0].equals(Long.toString(scId))) {
								SCIDfromUser2.remove(k);
								break;
							}
						}
						if (SCIDfromUser2.size() == 0) {
							if (checkTheseUsers.contains(userId)) {
								checkTheseUsers.remove(userId);
							}
							newUser.setSubClubList(null);
							newUser.setClubList(null);
							newUser.setSurveyAnswered(false);
							String[] userListInClub = updatedClub.getUserList().split(",");
							List<String> userListInClub2 = new ArrayList<String>(Arrays.asList(userListInClub));
							if (userListInClub2.contains(userId)) {
								userListInClub2.remove(userId);
							}
							if (userListInClub2.size() == 0) {
								updatedClub.setUserList(null);
							} else {
								String strForUC = String.join(",", userListInClub2);
								updatedClub.setUserList(strForUC);
							}
						} else {
							String strForNewUser = String.join(",", SCIDfromUser2);
							newUser.setSubClubList(strForNewUser);
						}
						userRepository.save(newUser);
					}
				}

				subClubRepository.deleteById(scId);
				deletedSC = deletedSC + Long.toString(scId);
				if (i != delSC.size() - 1) {
					deletedSC = deletedSC + ",";
				}
				scIdfromC2.remove(Long.toString(scId));

				// delete sub club from newsubclublist
				for (User user : userRepository.findAll()) {
					String usernewsubclubs = user.getNewSubClubList();

					if (user.isSurveyAnswered() == true && user.isThereNewClub()) {
						Boolean checkcontains = checkContainStringList(usernewsubclubs,  Long.toString(scId));
						if(checkcontains) {
							String newsubclublist = removeFromStringList(usernewsubclubs, Long.toString(scId));
							user.setNewSubClubList(newsubclublist);
							if (newsubclublist==null && user.getNewClubList()==null)
								user.setIsThereNewClub(false);
						}
					}
					userRepository.save(user);
				}
				
			}
			for (int j = 0; j < checkTheseUsers.size(); j++) {
				User checkedUser = userRepository.findByUserid(Long.parseLong(checkTheseUsers.get(j)));
				String[] SCIDfromCU = checkedUser.getSubClubList().split(",");
				List<String> SCIDfromCU2 = new ArrayList<String>(Arrays.asList(SCIDfromCU));
				boolean checkMembership = false;
				for (int k = 0; k < SCIDfromCU2.size(); k++) {
					String temp = SCIDfromCU2.get(k).substring(1, SCIDfromCU2.get(k).length() - 1);
					String[] temp2 = temp.split("-");
					if (subClubRepository.findBysubClubid(Long.parseLong(temp2[0])).getClubid() == Long
							.parseLong(clubId)) {
						checkMembership = true;
						break;
					}
				}
				if (!checkMembership) {
					String[] userListInClub = updatedClub.getUserList().split(",");
					List<String> userListInClub2 = new ArrayList<String>(Arrays.asList(userListInClub));
					String[] clstfrmusr = checkedUser.getClubList().split(",");
					List<String> clstfrmusr2 = new ArrayList<String>(Arrays.asList(clstfrmusr));
					if (clstfrmusr2.contains(clubId)) {
						clstfrmusr2.remove(clubId);
						if (clstfrmusr2.size() == 0) {
							checkedUser.setSubClubList(null);
							checkedUser.setClubList(null);
							checkedUser.setSurveyAnswered(false);
						} else {
							String strForCUCL = String.join(",", clstfrmusr2);
							checkedUser.setClubList(strForCUCL);
						}
						userRepository.save(checkedUser);
					}
					if (userListInClub2.contains(checkTheseUsers.get(j))) {
						userListInClub2.remove(checkTheseUsers.get(j));
						if (userListInClub2.size() == 0) {
							updatedClub.setUserList(null);
						} else {
							String strForUC = String.join(",", userListInClub2);
							updatedClub.setUserList(strForUC);
						}
					}

				}
			}
			String str = String.join(",", scIdfromC2);
			updatedClub.setSubClubList(str);
		}

		String deletedQ = "";

		if (delQ.size() != 0) {
			String[] qIdfromC = updatedClub.getQuestionList().split(",");
			List<String> qIdfromC2 = new ArrayList<String>(Arrays.asList(qIdfromC));
			isChanged = true;
			for (int i = 0; i < delQ.size(); i++) {
				Map q = delQ.get(i);
				Long qId = ((Number) q.get("id")).longValue();
				if (questionRepository.findByquestionid(qId) == null) {
					continue;
				}
				questionRepository.deleteById(qId);
				deletedQ = deletedQ + Long.toString(qId);
				if (i != delQ.size() - 1) {
					deletedQ = deletedQ + ",";
				}
				qIdfromC2.remove(Long.toString(qId));
			}
			String str = String.join(",", qIdfromC2);
			updatedClub.setQuestionList(str);
		}

		// BURAYA DA DÜZELTME GEREKEBİLİR!
		if (delSC.size() != 0 && isChanged) {
			String[] deletedSCList = deletedSC.split(",");
			List<String> deletedSCList2 = new ArrayList<String>(Arrays.asList(deletedSCList));
			String[] qIdfromCv2 = updatedClub.getQuestionList().split(",");
			List<String> qIdfromC2v2 = new ArrayList<String>(Arrays.asList(qIdfromCv2));
			for (int i = 0; i < qIdfromC2v2.size(); i++) {
				long id = Long.parseLong(qIdfromC2v2.get(i));
				Question qu = questionRepository.findByquestionid(id);
				if (deletedSCList2.contains(Long.toString(qu.getSubClubid()))) {
					qu.setSubClubid(-1);
					questionRepository.save(qu);
				}
			}
		}

		boolean isWarningSC = false;
		boolean isWarningQ = false;
		List<String> checkForUnique = new ArrayList<String>();
		if (addSC.size() != 0) {
			for (int i = 0; i < addSC.size(); i++) {
				Map subclub = addSC.get(i);
				String name = (String) subclub.get("name");
				if (name == null || name.length() == 0 || name.equals("General")) {
					isWarningSC = true;
					break;
				}
				if (subClubRepository.findByName(name) != null) {
					isWarningSC = true;
					break;
				}
				if (checkForUnique.size() == 0) {
					checkForUnique.add(name);
				} else {
					if (checkForUnique.contains(name)) {
						isWarningSC = true;
						break;
					} else {
						checkForUnique.add(name);
					}
				}
			}
		}

		if (addSC.size() != 0 && !isWarningSC) {
			List<String> newsubclublist = new ArrayList<String>();
			String updatedSCList = updatedClub.getSubClubList();
			for (int i = 0; i < addSC.size(); i++) {
				Map subclub = addSC.get(i);
				SubClub newSC = new SubClub();
				newSC.setName((String) subclub.get("name"));
				newSC.setClubid(updatedClub.getClubid());
				newSC.setAdmin(null);
				subClubRepository.save(newSC);
				newsubclublist.add(Long.toString(newSC.getSubClubid()));
				updatedSCList = updatedSCList + "," + newSC.getSubClubid();
			}

			isChanged = true;
			updatedClub.setSubClubList(updatedSCList);

			// new subclub add to user newsubclublist
			for (int i = 0; i < addSC.size(); i++) {

				String subclubid = newsubclublist.get(i);

				for (User user : userRepository.findAll()) {
					String userclubs = user.getClubList();
					if ((user.isSurveyAnswered() == true)) {
						String[] userclublist = null;
						try {
							userclublist = userclubs.split(",");
						} catch (Exception e) {
							userclublist[0] = userclubs;
						}
						List<String> listuserclub = Arrays.asList(userclublist);

						if (listuserclub.contains(clubId)) {
							user.setIsThereNewClub(true);
							try {
								if (user.getNewSubClubList() == null)
								user.setNewSubClubList(subclubid);
							else
								user.setNewSubClubList(user.getNewSubClubList() + "," + subclubid);
							}catch(Exception e) {
								
							}
							
						}
						userRepository.save(user);
					}
				}
			}

		}

		if (addQ.size() != 0) {
			for (int i = 0; i < addQ.size(); i++) {
				Map q = addQ.get(i);
				String question = (String) q.get("question");
				if (question == null || question.length() == 0) {
					isWarningQ = true;
				}
			}
		}

		if (addQ.size() != 0 && !isWarningQ && !isWarningSC) {
			String updatedQList = updatedClub.getQuestionList();
			for (int i = 0; i < addQ.size(); i++) {
				Map q = addQ.get(i);
				Question newQ = new Question();
				newQ.setQuestion((String) q.get("question"));
				float cof = Float.parseFloat((String) q.get("coefficient"));
				if (cof < 1) {
					newQ.setCoefficient(1);
				} else if (cof > 10) {
					newQ.setCoefficient(10);
				} else {
					newQ.setCoefficient(cof);
				}
				if (((String) q.get("subClubName")).equals("General")) {
					newQ.setSubClubid(-1);
				} else {
					try {
						long SCID = (subClubRepository.findByName((String) q.get("subClubName"))).getSubClubid();
						newQ.setSubClubid(SCID);
					} catch (Exception e) {
						newQ.setClubid(-1);
					}

				}
				newQ.setClubid(updatedClub.getClubid());
				questionRepository.save(newQ);
				updatedQList = updatedQList + "," + newQ.getQuestionid();
			}
			isChanged = true;
			updatedClub.setQuestionList(updatedQList);
		}

		if (isChanged) {
			clubRepository.save(updatedClub);
			if (isWarningQ) {
				return new GenericResponse(
						"Warning: Some questions may not have been added! Other edits have been successfully saved!");
			}
			if (isWarningSC) {
				return new GenericResponse(
						"Warning: Some sub-clubs/questions may not have been added! Other edits have been successfully saved!");
			}
			return new GenericResponse(updatedClub.getClubName() + " is updated!");
		} else {
			if (isWarningQ || isWarningSC) {
				return new GenericResponse("Error: Update failed!");
			}
			return new GenericResponse("Warning: There is no change!");
		}

	}

	@PostMapping("/surveyanswers")
	public GenericResponse surveyAnswers(@RequestBody final SurveyAnswersWithUserId survey,
			@CurrentUser User currentUser) {
		class subclubclass {
			long subclubid;
			long clubid;
			float total = 0;
			float score = 0;
		}

		class clubclass {
			long clubid;
			float total = 0;
			float score = 0;
		}

		List<subclubclass> arraylistsubclub = new ArrayList<>();
		List<clubclass> arraylistclub = new ArrayList<>();

		SurveyAnswers[] answer = survey.getSurveyAnswer();
		long userid = survey.getUserId();
		if (currentUser.getUserid() != userid || userRepository.findByUserid(userid) == null) {
			return new GenericResponse("Error: You are a hacker!");
		}
		if (currentUser.isSurveyAnswered()) {
			return new GenericResponse("Error: You already sent your answer!");
		}
		float coefficient;
		long subclubid;

		// club-subclub check
		for (int i = 0; i < answer.length; i++) {
			SurveyQuestion[] questionList = answer[i].getQuestionList();

			for (int j = 0; j < questionList.length; j++) {

				coefficient = questionRepository.findById((long) questionList[j].getId()).get().getCoefficient();
				subclubid = (long) questionRepository.findById((long) questionList[j].getId()).get().getSubClubid();
				float answerquestion = questionList[j].getAnswer();

				if (answerquestion == 0) {
					return new GenericResponse("Warning: Please fill out the questionnaire completely!");
				}

				// id check
				int checksubclub = 0;
				int checkclub = 0;
				for (int j2 = 0; j2 < arraylistsubclub.size(); j2++) {
					if (arraylistsubclub.get(j2).subclubid == subclubid)
						checksubclub = 1;
				}
				for (int j2 = 0; j2 < arraylistclub.size(); j2++) {
					long clubid = questionRepository.findById((long) questionList[j].getId()).get().getClubid();
					if (arraylistclub.get(j2).clubid == clubid)
						checkclub = 1;
				}

				if (checksubclub == 0 && subclubid != -1) {
					subclubclass sc = new subclubclass();
					sc.subclubid = subclubid;
					sc.clubid = questionRepository.findById((long) questionList[j].getId()).get().getClubid();
					arraylistsubclub.add(sc);
				}
				if (checkclub == 0) {
					clubclass c = new clubclass();
					c.clubid = questionRepository.findById((long) questionList[j].getId()).get().getClubid();
					arraylistclub.add(c);
				}
			}
		}
		// calculate club score
		for (int i = 0; i < answer.length; i++) {
			SurveyQuestion[] questionList = answer[i].getQuestionList();

			for (int j = 0; j < questionList.length; j++) {
				coefficient = questionRepository.findById((long) questionList[j].getId()).get().getCoefficient();
				subclubid = (long) questionRepository.findById((long) questionList[j].getId()).get().getSubClubid();
				float answerquestion = questionList[j].getAnswer();
				long clubid = questionRepository.findById((long) questionList[j].getId()).get().getClubid();
				for (int j2 = 0; j2 < arraylistclub.size(); j2++) {
					if (((arraylistclub.get(j2).clubid == clubid) && (subclubid == -1))) {
						if (arraylistclub.get(j2).score == 0) {
							arraylistclub.get(j2).score = answerquestion;
							arraylistclub.get(j2).total = coefficient;
						} else {
							float total = arraylistclub.get(j2).score * arraylistclub.get(j2).total;
							float newtotal = answerquestion * coefficient;
							arraylistclub.get(j2).total = arraylistclub.get(j2).total + coefficient;
							arraylistclub.get(j2).score = (total + newtotal) / arraylistclub.get(j2).total;
						}

					}
				}
			}
		}
		// calculate subclub score
		for (int i = 0; i < answer.length; i++) {
			SurveyQuestion[] questionList = answer[i].getQuestionList();

			for (int j = 0; j < questionList.length; j++) {
				coefficient = questionRepository.findById((long) questionList[j].getId()).get().getCoefficient();
				subclubid = (long) questionRepository.findById((long) questionList[j].getId()).get().getSubClubid();
				int clubindex = 0;
				float answerquestion = questionList[j].getAnswer();
				long clubid = questionRepository.findById((long) questionList[j].getId()).get().getClubid();
				for (int j2 = 0; j2 < arraylistclub.size(); j2++) {
					if (arraylistclub.get(j2).clubid == clubid) {
						clubindex = j2;
						break;
					}
				}
				for (int j2 = 0; j2 < arraylistsubclub.size(); j2++) {
					float clubscore = arraylistclub.get(clubindex).score;
					if (arraylistsubclub.get(j2).subclubid == subclubid && clubscore >= 3) {
						if (arraylistsubclub.get(j2).score == 0) {
							arraylistsubclub.get(j2).score = answerquestion;
							arraylistsubclub.get(j2).total = coefficient;
						} else {
							float total = arraylistsubclub.get(j2).score * arraylistsubclub.get(j2).total;
							float newtotal = answerquestion * coefficient;
							arraylistsubclub.get(j2).total = arraylistsubclub.get(j2).total + coefficient;
							arraylistsubclub.get(j2).score = (total + newtotal) / arraylistsubclub.get(j2).total;
						}

					}
				}
			}
		}
		boolean checkForWorstCase = true;
		for (int i = 0; i < arraylistsubclub.size(); i++) {
			if (arraylistsubclub.get(i).score >= 3) {
				checkForWorstCase = false;
				break;
			}
		}
		if (checkForWorstCase) {
			return new GenericResponse(
					"Warning: You should check your answer. We cannot add you to any club with respect to your answers!");
		}

		// user repository control
		User user = userRepository.findByUserid(userid);
		user.setSurveyAnswered(true);
		String userclubList = user.getClubList();
		String usersubclubList = user.getSubClubList();

		if (userclubList == null) {
			userclubList = "";
		}
		if (usersubclubList == null) {
			usersubclubList = "";
		}
		List<Long> listclub = new ArrayList<Long>();

		// added club list
		for (int i = 0; i < arraylistsubclub.size(); i++) {
			long clubid = arraylistsubclub.get(i).clubid;
			float score = arraylistsubclub.get(i).score;

			if (!listclub.contains(clubid) && score >= 3) {
				listclub.add(clubid);
			}
		}

		// user clublist update
		for (int i = 0; i < listclub.size(); i++) {
			String newclub = Long.toString(listclub.get(i));
			if (userclubList.equals("")) {
				userclubList = newclub;
			} else {
				userclubList = userclubList + "," + newclub;
			}

		}
		user.setClubList(userclubList);

		// user subclublist update
		for (int i = 0; i < arraylistsubclub.size(); i++) {
			if (arraylistsubclub.get(i).score >= 3) {
				String newclub = Long.toString(arraylistsubclub.get(i).subclubid);
				String score = Float.toString(arraylistsubclub.get(i).score);
				if (usersubclubList.equals("")) {
					usersubclubList = "[" + newclub + "-" + score + "]";
				} else {
					usersubclubList = usersubclubList + "," + "[" + newclub + "-" + score + "]";
				}
			}
		}
		user.setSubClubList(usersubclubList);

		userRepository.save(user);

		String userid2 = Long.toString(userid);

		// club repository add user
		for (int i = 0; i < listclub.size(); i++) {
			long clubid = listclub.get(i);
			Club club = clubRepository.findByclubid(clubid);

			if (club.getUserList() == null) {
				club.setUserList("");
			}

			if (club.getUserList().equals("")) {
				club.setUserList(userid2);
			} else {
				club.setUserList(club.getUserList() + "," + userid2);
			}
			clubRepository.save(club);
		}

		// subclub repository add user

		for (int i = 0; i < arraylistsubclub.size(); i++) {
			if (arraylistsubclub.get(i).score >= 3) {
				long addedsubclubid = arraylistsubclub.get(i).subclubid;
				SubClub subclub = subClubRepository.findBysubClubid(addedsubclubid);
				if (subclub.getUserList() == null) {
					subclub.setUserList("");
				}
				if (subclub.getUserList().equals("")) {
					subclub.setUserList(userid2);
				} else {
					subclub.setUserList(subclub.getUserList() + "," + userid2);
				}
				subClubRepository.save(subclub);
			}
		}

		return new GenericResponse("Success: Survey completed!");
	}

	@PostMapping("/surveynewclubs")
	public GenericResponse surveyNewClubs(@RequestBody final SurveyAnswersWithUserId survey,
			@CurrentUser User currentUser) {
		
		if (currentUser.isThereNewClub() == false
				|| (currentUser.getNewClubList() == null || currentUser.getNewClubList().equals(""))
						&& (currentUser.getNewSubClubList() == null || currentUser.getNewSubClubList().equals(""))) {
			return new GenericResponse("Error: Questions of all clubs have already been answered!");
		}
		String userexistclubs = currentUser.getClubList();
		String[] existingclublist = null;

		try {
			existingclublist = userexistclubs.split(",");
		} catch (Exception e) {
			existingclublist[0] = userexistclubs;
		}

		class subclubclass {
			long subclubid;
			long clubid;
			float total = 0;
			float score = 0;
		}

		class clubclass {
			long clubid;
			float total = 0;
			float score = 0;
		}

		List<subclubclass> arraylistsubclub = new ArrayList<>();
		List<clubclass> arraylistclub = new ArrayList<>();

		SurveyAnswers[] answer = survey.getSurveyAnswer();
		long userid = survey.getUserId();
		if (currentUser.getUserid() != userid || userRepository.findByUserid(userid) == null) {
			return new GenericResponse("Error: You are a hacker!");
		}

		float coefficient;
		long subclubid;

		// club-subclub check
		for (int i = 0; i < answer.length; i++) {
			SurveyQuestion[] questionList = answer[i].getQuestionList();

			for (int j = 0; j < questionList.length; j++) {

				coefficient = questionRepository.findById((long) questionList[j].getId()).get().getCoefficient();
				subclubid = (long) questionRepository.findById((long) questionList[j].getId()).get().getSubClubid();
				float answerquestion = questionList[j].getAnswer();

				if (answerquestion == 0) {
					return new GenericResponse("Warning: Please fill out the questionnaire completely!");
				}

				// id check
				int checksubclub = 0;
				int checkclub = 0;
				for (int j2 = 0; j2 < arraylistsubclub.size(); j2++) {
					if (arraylistsubclub.get(j2).subclubid == subclubid)
						checksubclub = 1;
				}
				for (int j2 = 0; j2 < arraylistclub.size(); j2++) {
					long clubid = questionRepository.findById((long) questionList[j].getId()).get().getClubid();
					if (arraylistclub.get(j2).clubid == clubid)
						checkclub = 1;
				}

				if (checksubclub == 0 && subclubid != -1) {
					subclubclass sc = new subclubclass();
					sc.subclubid = subclubid;
					sc.clubid = questionRepository.findById((long) questionList[j].getId()).get().getClubid();
					arraylistsubclub.add(sc);
				}
				if (checkclub == 0) {
					clubclass c = new clubclass();
					c.clubid = questionRepository.findById((long) questionList[j].getId()).get().getClubid();
					arraylistclub.add(c);
				}
			}
		}
		// calculate club score
		for (int i = 0; i < answer.length; i++) {
			SurveyQuestion[] questionList = answer[i].getQuestionList();

			for (int j = 0; j < questionList.length; j++) {
				coefficient = questionRepository.findById((long) questionList[j].getId()).get().getCoefficient();
				subclubid = (long) questionRepository.findById((long) questionList[j].getId()).get().getSubClubid();
				float answerquestion = questionList[j].getAnswer();
				long clubid = questionRepository.findById((long) questionList[j].getId()).get().getClubid();
				for (int j2 = 0; j2 < arraylistclub.size(); j2++) {
					if (((arraylistclub.get(j2).clubid == clubid) && (subclubid == -1))) {
						if (arraylistclub.get(j2).score == 0) {
							arraylistclub.get(j2).score = answerquestion;
							arraylistclub.get(j2).total = coefficient;
						} else {
							float total = arraylistclub.get(j2).score * arraylistclub.get(j2).total;
							float newtotal = answerquestion * coefficient;
							arraylistclub.get(j2).total = arraylistclub.get(j2).total + coefficient;
							arraylistclub.get(j2).score = (total + newtotal) / arraylistclub.get(j2).total;
						}

					}
				}
			}
		}

		// calculate subclub score
		for (int i = 0; i < answer.length; i++) {
			SurveyQuestion[] questionList = answer[i].getQuestionList();

			for (int j = 0; j < questionList.length; j++) {
				coefficient = questionRepository.findById((long) questionList[j].getId()).get().getCoefficient();
				subclubid = (long) questionRepository.findById((long) questionList[j].getId()).get().getSubClubid();
				int clubindex = 0;
				float answerquestion = questionList[j].getAnswer();
				long clubid = questionRepository.findById((long) questionList[j].getId()).get().getClubid();
				for (int j2 = 0; j2 < arraylistclub.size(); j2++) {
					if (arraylistclub.get(j2).clubid == clubid) {
						clubindex = j2;
						break;
					}
				}
				for (int j2 = 0; j2 < arraylistsubclub.size(); j2++) {
					float clubscore = arraylistclub.get(clubindex).score;
					if (arraylistsubclub.get(j2).subclubid == subclubid && clubscore >= 3 || (arraylistsubclub.get(j2).subclubid == subclubid && userexistclubs.contains(Long.toString(clubid)))) {
						if (arraylistsubclub.get(j2).score == 0) {
							arraylistsubclub.get(j2).score = answerquestion;
							arraylistsubclub.get(j2).total = coefficient;
						} else {
							float total = arraylistsubclub.get(j2).score * arraylistsubclub.get(j2).total;
							float newtotal = answerquestion * coefficient;
							arraylistsubclub.get(j2).total = arraylistsubclub.get(j2).total + coefficient;
							arraylistsubclub.get(j2).score = (total + newtotal) / arraylistsubclub.get(j2).total;
						}

					}
				}
			}
		}

		// user repository control
		User user = userRepository.findByUserid(userid);
		user.setIsThereNewClub(false);
		String userclubList = user.getClubList();
		String usersubclubList = user.getSubClubList();

		if (userclubList == null) {
			userclubList = "";
		}
		if (usersubclubList == null) {
			usersubclubList = "";
		}
		List<Long> listclub = new ArrayList<Long>();

		// added club list

		for (int i = 0; i < arraylistsubclub.size(); i++) {
			long clubid = arraylistsubclub.get(i).clubid;
			float score = arraylistsubclub.get(i).score;

			if (!listclub.contains(clubid) && score >= 3 && (!userexistclubs.contains(Long.toString(clubid)))) {
				listclub.add(clubid);
			}
		}

		// user clublist update
		for (int i = 0; i < listclub.size(); i++) {
			String newclub = Long.toString(listclub.get(i));
			if (userclubList.equals("")) {
				userclubList = newclub;
			} else {
				userclubList = userclubList + "," + newclub;
			}

		}
		user.setClubList(userclubList);

		// user subclublist update
		for (int i = 0; i < arraylistsubclub.size(); i++) {
			if (arraylistsubclub.get(i).score >= 3) {
				String newclub = Long.toString(arraylistsubclub.get(i).subclubid);
				String score = Float.toString(arraylistsubclub.get(i).score);
				if (usersubclubList.equals("")) {
					usersubclubList = "[" + newclub + "-" + score + "]";
				} else {
					usersubclubList = usersubclubList + "," + "[" + newclub + "-" + score + "]";
				}
			}
		}
		user.setSubClubList(usersubclubList);
		user.setIsThereNewClub(false);
		user.setNewClubList(null);
		user.setNewSubClubList(null);

		userRepository.save(user);

		String userid2 = Long.toString(userid);

		// club repository add user
		for (int i = 0; i < listclub.size(); i++) {
			long clubid = listclub.get(i);
			if (!userexistclubs.contains(Long.toString(clubid))) {
				Club club = clubRepository.findByclubid(clubid);

				if (club.getUserList() == null) {
					club.setUserList("");
				}

				if (club.getUserList().equals("")) {
					club.setUserList(userid2);
				} else {
					club.setUserList(club.getUserList() + "," + userid2);
				}
				clubRepository.save(club);
			}
		}

		// subclub repository add user

		for (int i = 0; i < arraylistsubclub.size(); i++) {
			if (arraylistsubclub.get(i).score >= 3) {
				long addedsubclubid = arraylistsubclub.get(i).subclubid;
				SubClub subclub = subClubRepository.findBysubClubid(addedsubclubid);
				if (subclub.getUserList() == null) {
					subclub.setUserList("");
				}
				if (subclub.getUserList().equals("")) {
					subclub.setUserList(userid2);
				} else {
					subclub.setUserList(subclub.getUserList() + "," + userid2);
				}
				subClubRepository.save(subclub);
			}
		}

		return new GenericResponse("Success: Survey completed!");
	}
	private String removeFromStringList(String strList, String removedid) {

		String[] ids = strList.split(",");

		ArrayList<String> newids = new ArrayList<String>();

		for (int i = 0; i < ids.length; i++) {

			if (Long.parseLong(ids[i]) != Long.parseLong(removedid)) {
				newids.add(ids[i]);
			}

		}
		if (newids.isEmpty()) {
			return null;
		}

		else {

			StringBuilder str = new StringBuilder("");

			for (String newid : newids) {

				str.append(newid).append(",");
			}

			String commaseparatedlist = str.toString();

			if (commaseparatedlist.length() > 0)
				commaseparatedlist = commaseparatedlist.substring(0, commaseparatedlist.length() - 1);

			return commaseparatedlist;
		}

	}

	private Boolean checkContainStringList(String strList, String removedid) {
		if(strList==null)
			return false;
		String[] ids = strList.split(",");

		List<String> existinglist = Arrays.asList(ids);

		if (existinglist.contains(removedid)) {
			return true;
		} else
			return false;
	}

}
