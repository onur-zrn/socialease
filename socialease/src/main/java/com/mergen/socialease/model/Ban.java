package com.mergen.socialease.model;

import java.util.Calendar;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class Ban {

    @Id
    @GeneratedValue
    @Column
    private long banid;

    private String userName;

    private Long subClubid;

    private Date bannedUntil;

    private int banNumber;

    private boolean isDismissed = false;

    private boolean isActive;

    private Calendar calendar;

    private Calendar c;

    public Ban(){ }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean isActive) {
        this.isActive = isActive;
    }

    public Ban(String userName, Long subClubid){
        this.userName = userName;
        this.subClubid = subClubid;
        c = calendar.getInstance();
        c.add(c.DAY_OF_MONTH,5);
        this.bannedUntil = c.getTime();
        this.banNumber=1;
        this.setActive(true);
    }

    public void banIncrement(){
        c.add(c.DAY_OF_MONTH,5);
        this.bannedUntil = c.getTime();
    }


    public String getUserName() {
        return userName;
    }

    public boolean isDismissed() {
        return isDismissed;
    }

    public void setDismissed(boolean isDismissed) {
        this.isDismissed = isDismissed;
    }

    public int getBanNumber() {
        return banNumber;
    }

    public void setBanNumber(int banNumber) {
        this.banNumber = banNumber;
    }

    public Date getBannedUntil() {
        return bannedUntil;
    }

    public void setBannedUntil(Date bannedUntil) {
        this.bannedUntil = bannedUntil;
    }

    public Long getSubClubid() {
        return subClubid;
    }

    public void setSubClubid(Long subClubid) {
        this.subClubid = subClubid;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

}
