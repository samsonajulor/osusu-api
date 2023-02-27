# OSUSU Application Documentation

- [walk through](https://drive.google.com/file/d/1nDzfx7bvfm7yJxdFNKBJofk6w7I1iYwH/view?usp=sharing)
- [DOCUMENTATION](https://documenter.getpostman.com/view/18357475/2s93CRKWsU#a9dc2324-bedc-43a9-80d1-56a979326802)

## How to start the APP
- delete any existing migrations file
- ensure that postgres is up and running
- this version is created to run locally so create a database called appcake
- create a .env file at the root of the repository.
- copy and update the configs from .env.sample
- run `yarn`
- run `yarn migration:generate`
- run `yarn migration:run`
- run `yarn start:dev`
## Overview

This is a NestJS application with TypeScript, Yarn, Postgres, and TypeORM. The application has three main entities: User, OTP, and Plan. The application provides services for authentication, user management, and plan management.

**Entities**

1. _User_
   A User is a person who uses the application. The User entity has the following attributes:

- id: unique identifier for the user (autogenerated, not null)
- email: unique email for the user (string, not null)
- username: unique username for the user (string, nullable)
- phoneNumber: unique phone number for the user (string, nullable)
- password: user's password (string, nullable)
- firstName: user's first name (string, nullable)
- lastName: user's last name (string, nullable)
- accountNumber: user's bank account number (string, not null)

2. _OTP_
   An OTP (One-Time Password) is a temporary code that is used for authentication. The OTP entity has the following attributes:

- id: unique identifier for the OTP (autogenerated, not null)
- code: the OTP code (string, not null)
- status: the status of the OTP (enum, IDLE, USED, or EXPIRED)
- email: the email address to which the OTP is sent (string, not null)
- createdAt: the date and time when the OTP is created (date, not null)
- updatedAt: the date and time when the OTP is last updated (date, not null)

3. _Plan_
   A Plan is a savings plan that a user can create. The Plan entity has the following attributes:

- id: unique identifier for the plan (autogenerated, not null)
- title: title of the plan (string, not null)
- numberOfBuddies: the number of buddies associated with the plan (nullable, array of users)
- hasTarget: whether the plan has a target savings amount (boolean, not null)
- autoDebit: whether the plan is set up for automatic debit (boolean, not null)
- frequencyOfSavings: the frequency of savings (enum, DAILY, WEEKLY, or MONTHLY)
- startDate: the start date of the plan (date string, not null)
- targetSavingsAmount: the target savings amount (nullable, bigint)
- endDate: the end date of the plan (date string, not null, autogenerated from the duration and startDate)
- creator: the email address of the user who created the plan (string, not null)
- duration: the duration of the plan (enum, THREE_MONTHS, SIX_MONTHS, or TWELVE_MONTHS)
- isActive: whether the plan is active (boolean, not null)
- createdAt: the date and time when the plan is created (date, not null)
- updatedAt: the date and time when the plan is last updated (date, not null)

## AUTH SERVICE

**Register METHOD:**
This METHOD allows a user to register by providing their email address. Upon registration, an OTP code is generated and sent to the user's email address for verification.

**Login METHOD:**
This METHOD allows a registered user to login using their email and password. Upon successful login, the system keeps track of the session.

**Create Password METHOD:**
This METHOD allows a user to create a password during the registration flow.

**Send Reset Password OTP**
This METHOD sends an otp to a registered user which can be used to reset the password

**Reset Password METHOD:**
This METHOD allows a user to reset their password if they have forgotten it. The user is able to enter their email address, and an OTP code sent from the send reset password otp. If the code is valid, this methods removes the previous password and the user can now create a new password.

**Change Password METHOD:**
This METHOD allows a logged-in user to change their password. The user is able to enter their current password and the new password they want to set.

**Logout METHOD:**
This METHOD allows a logged-in user to log out by invalidating their JWT token.

## OTP METHOD

**Generate OTP METHOD:**
This METHOD will be responsible for generating an OTP and saving it to the database along with the associated user.

**Verify OTP METHOD:**
This METHOD will be responsible for verifying that the OTP entered by the user is correct and has not expired. If the OTP is correct and not expired, it will mark the OTP as used.

**Expire OTP METHOD:**
This METHOD will be responsible for expiring an OTP that has not been used within the specified time limit.

**Resend OTP METHOD:**
This METHOD will be responsible for resending an OTP to the user in case they did not receive it or need to generate a new one.

## PLAN SERVICE

**Create Plan METHOD:**
This METHOD handles the creation of a new plan. The creator is automatically a subscriber to the plan.

**Update Plan METHOD:**
This METHOD handles the update of an existing plan.

**Get Plan METHOD:**
This METHOD handles the retrieval of a single plan by its ID.

**Get All Plans METHOD:** This METHOD handles the retrieval of all available plans that a user is a subscriber to.

**Delete Plan METHOD:** This METHOD handles the deletion of a plan by its ID.

**Subscribe To Plan METHOD:** This METHOD handles the subscription of at most 5 registered users to a plan. A notification mail is sent when a new subscriber is added. Inviting the user to either join or decline an invitation

**GetSubscribed Plans METHOD:** This METHOD handles the retrieval of all plans subscribed to by a user.

**Unsubscribe From Plan METHOD:** This service handles the unsubscription of a user from a plan.


## Suggested Updates
1. Number of buddies should be automatically added.
2. EndDate should be automatically calculated.
3. Status of a plan should be activated once the startDate is equal to today.
4. A new entity for the buddyRelationship