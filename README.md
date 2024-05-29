This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses two fonts: **Glory** (content) and **Fjalla One** (MySurface naming).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Database

In the MySurface project, we utilize the Supabase database along with its integrated authentication system and RLS policies to control access to the information stored in our tables. 

### Design

These are the tables forming the backbone of our database design:
- **Languages**: Stores the languages available for the app.
	- **id**: Unique identifier for each language entry.
 	- **code**: Code representing the language.
	- **name**: Name of the language.
- **Organizations**: Stores the potential organizations to which a user may belong.
	- **id**: Unique identifier for each organization entry.
 	- **name**: Name of the organization type.
- **App_settings**: Stores the information related to the user.
	- **id**: Unique identifier for each app_settings entry.
 	- **isEnrollmentPhase**: Boolean value that controls whether the actual test that a user is running is in _enrollment_ or _questionnaires_ phase. Default value is TRUE.
	- **user_id**: UUID that references the auth.users id column.
	- **language_id**: ID that references the languages id column. Sets the language preference for a user. Default value is 1 (English).
	- **organization_id**: ID that references the organizations id column. Sets the organization selected by a user. Default value is 1 (Company).
	- **name**: Name of the user.
	- **organization**: Name of the organization to which the user belongs.
	- **email**: Email account of the user.
- **Roles**: Stores the role of the user.
	- **user_id**: UUID that references the auth.users id column.
 	- **role**: Actual role of the user; _authenticated_ is the default value and _superadmin_ must be set for higher level of accounts.
- **Questions**: Stores the different questions available, depending on language and organization.
	- **id**: Unique identifier for each questionnaire entry.
 	- **created_at**: The timestamp indicating when the entry was created.
 	- **question**: Text containing the question.
 	- **weight**: Weight value of the question. Set default to 0.5.
 	- **question_type**: Type of the question can be set to interaction or influence.
 	- **language_id**: ID that references the languages id column.
 	- **organization_id**: ID that references the organizations id column.
 	- **process_id**: ID that references the processes id column. Assessment type.
- **Questionnaires**: Stores the questionnaire related to a participant. **After completing the report, the related questionnaires records will be deleted.**
	- **id**: Unique identifier for each questionnaire entry.
 	- **created_at**: The timestamp indicating when the entry was created.
 	- **completed**: Boolean value that controles whether the actual questionnaire has been completed or not.
 	- **data**: JSON file that stores the needed information with questions and answers for each participant.
- **Participants**: Stores the information for each participant that will complete a questionnaire. **After completing the report, the related participants records will be deleted.**
	- **id**: Unique identifier for each participant entry.
 	- **created_at**: The timestamp indicating when the entry was created.
 	- **name**: Name of the participant.
 	- **email**: Email of the participant.
 	- **questionnaire**: UUID that references the questionnaires id column. Set default as NULL.
 	- **user_id**: UUID that references the auth.users id column. Represents the manager of the team who added the participant.
- **Results**: Stores the information of a report's results.
	- **id**: Unique identifier for each result entry.
 	- **created_at**: The timestamp indicating when the entry was created.
 	- **result**: JSON file that stores the needed information for the graph generation.
 	- **report_name**: Name of the report.
 	- **user_id**: UUID that references the auth.users id column. Represents owner ot the report.
- **Deleted_reports**: Stores the information of a report that has been deleted.
	- **id**: Unique identifier for each result entry.
  	- **deleted_at**: The timestamp indicating when the report was deleted.
 	- **created_at**: The timestamp indicating when the report was created.
 	- **result**: JSON file that stores the needed information for the graph generation.
 	- **report_name**: Name of the report.
 	- **user_name**: Name of the user that owned the report.
	- **organization**: Name of the organization of the owner.
- **Assessed**: Stores the information for each assessed, that can be either a leader or product. **After completing the report, the related assessed records will be deleted.**
	- **id**: Unique identifier for each assessed entry.
 	- **created_at**: The timestamp indicating when the record was inserted.
 	- **name**: Name of assessed.
 	- **description**: Description of assessed, optional.
 	- **user_id**: UUID that references the auth.users id column. Represents the manager of the team who added the assessed.
	- **type**: Type of assessed wich can be leader or product.
- **Billings**: Stores the information of each actual billing of users.
	- **id**: Unique identifier for each billing entry.
  	- **updated_at**: The timestamp indicating when the record has been updated.
 	- **expiration_date**: The timestamp indicating when the license expires.
 	- **subscription**: Indicates the license type: none, trial, yearly or lifetime.
 	- **user_id**: UUID that references the auth.users id column. Represents the owner of the billing.
 	- **isTrialUsed**: Boolean value. When a user activates a trial it must be set to true.
	- **status**: Status of the license, active or inactive.
	- **session_id**: ID of the session that is created by Stripe when processing license payment.
	- **payment_id**: Payment intent ID from Stripe.
	- **email**: Customer's email when payment is executed in Stripe.
- **Notifications**: Stores the internal notifications in different languages.
	- **id**: Unique identifier for each notification entry.
  	- **created_at**: The timestamp indicating when the record has been created.
 	- **message**: Content of the notification.
 	- **type**: Notification type which can be set to update or news.
 	- **link**: Link related to view details of the notification. It's optional.
 	- **language_id**: ID that references languages table ID. Represents the language of the notification.
- **Processes**: Stores the available assessment processes.
	- **id**: Unique identifier for each process entry.
  	- **type**: Name of the process.

### Authentication

When a user signs up, a trigger is activated to add the required information to the public database schema. In Supabase, user information is stored in a separate table called **auth.users**, which is governed by strict policies to ensure the security of sensitive data. Consequently, any additional user information must be stored in the separate public database schema.

The trigger, named **new_user_trigger**, activates upon the insertion of a record into the _auth.users_ table, executing the function **handle_new_user**. This function inserts the user's ID and email into the _public.app_settings_ table and subsequently adds the user's ID into the _public.roles_ table. Any unspecified values are automatically set to default. It also adds a record into _public.billings_ table with related values.

### Cron Jobs

There is a cron job named _update_expired_subscriptions_daily_ which runs everyday at 00:00 UTC and executes the function called _update_expired_subscriptions_. This way expired subscriptions are handled.

### Additional Triggers and Functions

#### 1. Create report backup after user deletion
- **Trigger Name**: user_before_delete_trigger
- **Function Name**: before_delete_user_trigger
- **Description**:
This trigger is designed to execute before a user is deleted from the _auth.users_ table. Upon activation, it calls the function before_delete_user_trigger, which retrieves the user's name and organization from the _app_settings_ table. Additionally, it retrieves the user's activity data, including the creation timestamp, result, and report name, from the _results_ table. Subsequently, it inserts a record into the _deleted_reports_ table, capturing relevant information about the user's activities prior to deletion.

#### 2. Create report backup after its deletion
- **Trigger Name**: report_before_delete_trigger
- **Function Name**: before_delete_report_trigger
- **Description**:
The report_before_delete_trigger trigger is designed to execute before a row is deleted from the _results_ table. It automatically invokes the before_delete_report_trigger function. This trigger function retrieves the user's name and organization from the _app_settings_ table based on the provided user_id. It then inserts the deleted report's data along with the user's name and organization into the _deleted_reports_ table.

#### 3. Delete user function
- **Function Name**: delete_user
- **Parameters**:
	- **user_id**: The unique identifier of the user to be deleted from the _auth.users_ table.
- **Description**:
The delete_user function is a standalone function designed to delete a user from the _auth.users_ table based on the provided user_id. When invoked with a valid user_id, the function deletes the corresponding user record from the _auth.users_ table.

#### 4. Delete user related questionnaires function
- **Function Name**: delete_user_related_questionnaires
- **Description**:
Deletes related questionnaires to participants that have been added by the user and are about to be deleted by the ON DELETE CASCADE clause.

#### 5. Return inserted assessed
- **Function Name**: insert_assessed_and_return
- **Parameters**:
	- **new_name**: Name field.
	- **new_description**: Description field.
	- **new_type**: Type field.
- **Description**:
Returns the record that has been inserted into assessed table. It is necessary to get the assigned ID and thus, add it into interface table.

#### 6. Return inserted notification
- **Function Name**: insert_notification_and_return
- **Parameters**:
	- **new_language_id**: Language_id field.
	- **new_message**: Message field.
	- **new_link**: Link field.
	- **new_type_notification**: Type field.
- **Description**:
Returns the record that has been inserted into notifications table. It is necessary to get the assigned ID and thus, add it into interface table.

#### 7. Return inserted participant
- **Function Name**: insert_participant_and_return
- **Parameters**:
	- **new_email**: Email field.
	- **new_name**: Name field.
- **Description**:
Returns the record that has been inserted into participants table. It is necessary to get the assigned ID and thus, add it into interface table.

#### 8. Restrict insert into assessed
- **Function Name**: restrict_assessed_insert_by_subscription
- **Description**:
Checks the actual subscription and status of the logged user and restricts insert into assessed table. If subscription is inactive or none, the insert is rejected. If the subscription is trial the user can just add up to 20 assessed and if it's yearly can add up to 500. A user with a lifetime subscription has no restrictions.

#### 9. Restrict insert into participants
- **Function Name**: restrict_participants_insert_by_subscription
- **Description**:
Checks the actual subscription and status of the logged user and restricts insert into participants table. If subscription is inactive or none, the insert is rejected. If the subscription is trial the user can just add up to 35 participants and if it's yearly can add up to 500. A user with a lifetime subscription has no restrictions.

#### 10. Activate free trial
- **Function Name**: update_billing_trial
- **Parameters**:
	- **logged_user_id**: ID of the logged user, which references the table auth.users.
- **Description**:
Activates the free trial of the logged user; setting subscription to _trial_ and isTrialUsed to _true_. Then, updated expiration_date adding a 30 days interval from current date.

#### 11. Activate annual license
- **Function Name**: update_billing_yearly
- **Parameters**:
	- **logged_user_id**: ID of the logged user, which references the table auth.users.
	- **stripe_session_id**: Session_id field.
	- **stripe_payment_id**: Payment_id field.
	- **stripe_email**: Email field.
- **Description**:
Activates the annual license of the logged user after successful payment in Stripe; setting subscription to _yearly_ and adding Stripe related parameters. Then, updated expiration_date adding a 360 days interval from current date. If the user activates a new license before it has expired, adds remaining time to the expiration date.

#### 12. Lifetime expiration date update
- **Function Name**: update_expiration_date_lifetime
- **Description**:
Updates expiration_date to NULL when lifetime subscription is selected.

#### 13. Handle expired subscriptions
- **Function Name**: update_expired_subscriptions
- **Description**:
Checks the expiration_date of subscriptions in billings table and if expired, sets subscription to _none_. A cron scheduled task runs this function everyday at 00:00 UTC.

#### 14. Update status based on subscription
- **Function Name**: update_status_based_on_subscription
- **Description**:
Updates status of subscription depending on the type. If none sets to _inactive_, otherwise to _active_.

#### 15. Update updated_at in billings
- **Function Name**: update_updated_at_column
- **Description**:
Updates the column updated_at in billings table to current time.

### RLS Policies

Row-Level Security (RLS) policies in Supabase provide a powerful mechanism for controlling access to rows within database tables based on specified criteria. 

While every user is automatically assigned the 'authenticated' role in Supabase, the 'role' column in the roles table is utilized for managing policies and determining access permissions. This setup enables the management of access control for displaying or concealing elements within the interface, enhancing data security and user privacy compliance. 

## Editing Texts with i18n using JSON Files (Patterns and Models)

### Overview
Each page consists of 12 containers containing titles and subtitles or texts. These texts can be easily edited through JSON files associated with locales.

### Directory Structure
The language-specific JSON files are organized within the **/public/locales** directory. Within this directory, you'll find separate folders for each supported language, labeled /en for English, /cs for Czech, and /es for Spanish. Each language folder contains the JSON file corresponding to that language.

### Step-by-Step Guide
1. **Locate the JSON Files**: Navigate to the directory where localization JSON files are stored: **/public/locales**. These files contain key-value pairs for different languages.
2. **Identify the Key for the Text to Edit**: Each text element on the application should have a corresponding key in the JSON file. These keys are used to identify the text to be displayed.
3. **Choose the Desired Language**: Open the folder corresponding to the language you want to edit. For example, if you want to edit texts in English, open the /en folder.
4. **Locate the Key-Value Pair**: Search for the key associated with the text you wish to edit within the JSON file. The keys should be descriptive and indicative of the content they represent.
    For editing Patterns and Models pages content, you can update these values in the JSON file:
   
```json
	"patterns": {
		"p1": {
			"title": "Pattern 1",
			"subtitle": "Description of the pattern 1."
		},
		"p2": {
			"title": "Pattern 2",
			"subtitle": "Description of the pattern 2."
		},
		"p3": {
			"title": "Pattern 3",
			"subtitle": "Description of the pattern 3."
		},
		"p4": {
			"title": "Pattern 4",
			"subtitle": "Description of the pattern 4."
		},
		"p5": {
			"title": "Pattern 5",
			"subtitle": "Description of the pattern 5."
		},
		"p6": {
			"title": "Pattern 6",
			"subtitle": "Description of the pattern 6."
		},
		"p7": {
			"title": "Pattern 7",
			"subtitle": "Description of the pattern 7."
		},
		"p8": {
			"title": "Pattern 8",
			"subtitle": "Description of the pattern 8."
		},
		"p9": {
			"title": "Pattern 9",
			"subtitle": "Description of the pattern 9."
		},
		"p10": {
			"title": "Pattern 10",
			"subtitle": "Description of the pattern 10."
		},
		"p11": {
			"title": "Pattern 11",
			"subtitle": "Description of the pattern 11."
		},
		"p12": {
			"title": "Pattern 12",
			"subtitle": "Description of the pattern 12."
		}
	},
	"models": {
		"m1": {
			"title": "Model 1",
			"subtitle": "Description of the model 1."
		},
		"m2": {
			"title": "Model 2",
			"subtitle": "Description of the model 2."
		},
		"m3": {
			"title": "Model 3",
			"subtitle": "Description of the model 3."
		},
		"m4": {
			"title": "Model 4",
			"subtitle": "Description of the model 4."
		},
		"m5": {
			"title": "Model 5",
			"subtitle": "Description of the model 5."
		},
		"m6": {
			"title": "Model 6",
			"subtitle": "Description of the model 6."
		},
		"m7": {
			"title": "Model 7",
			"subtitle": "Description of the model 7."
		},
		"m8": {
			"title": "Model 8",
			"subtitle": "Description of the model 8."
		},
		"m9": {
			"title": "Model 9",
			"subtitle": "Description of the model 9."
		},
		"m10": {
			"title": "Model 10",
			"subtitle": "Description of the model 10."
		},
		"m11": {
			"title": "Model 11",
			"subtitle": "Description of the model 11."
		},
		"m12": {
			"title": "Model 12",
			"subtitle": "Description of the model 12."
		}
	}
```
5. **Edit the Text Value**: Once you've located the key, you'll see its corresponding text value. Modify the text within the double quotes to reflect the desired changes. Be careful not to alter the key itself.
6. **Save Changes**: After making the necessary edits, save the changes to the JSON file.

## Editing Images in Patterns

### Overview
In Patterns page, every container contains a default image that can be replaced with the desired one. Images are stored within the /public directory, and to update the image displayed on the page, you'll need to modify the src attribute within the corresponding JSX file.

### Directory Structure
Images are stored within the /public directory of the project. When referencing these images in your code, you'll use the format /[filename.extension] to specify the path. The file you'll be editing to update the images on the Patterns page is located at src/app/home/patterns/page.tsx.

### Step-by-Step Guide
1. **Choose and Save the Desired Image**: Select the image you wish to display on the Patterns page. Ensure that the image file is saved within the /public directory and is accessible to the application.
2. **Determine the Image Filename**: Note down the filename and extension of the chosen image. This information will be used to specify the path when referencing the image in your code.
3. **Open the Patterns Page File**: Locate the page.tsx file responsible for rendering the Patterns page. This file is located at src/app/home/patterns/page.tsx.
4. **Find the Image Element**: Within the JSX code of the Patterns page file, locate the <img> element responsible for displaying the image. This is an example of the container's structure, where the image tag is located at the end.
```html
  <div className="w-full p-5 shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
    <h2 className="font-bold text-xl md:text-lg">
      <T tkey="patterns.p1.title" />
    </h2>
    <p className="text-gray-600 dark:text-gray-400 text-lg md:text-base mb-2">
      <T tkey="patterns.p1.subtitle" />
    </p>
    <img
      src="/stock.jpg"
      alt="stock"
      className="w-full rounded-lg"
    />
  </div>
```
5. **Update the Image Source (src)**: Modify the src attribute of the <img> element to point to the desired image. Use the format /[filename.extension] to specify the path relative to the /public directory. For example, if your image is named example.jpg, the src attribute should be updated to /example.jpg.
6. **Save Changes**: After updating the src attribute with the correct image path, save the changes to the page.tsx file.

## Adding a New Question to FAQ Page

### Overview
The FAQ page provides answers to frequently asked questions. To add a new question, you'll need to modify the page.tsx file located at src/app/home/faq/page.tsx. Additionally, you'll update the translation keys in the i18n JSON file to include the new question and answer.

### Step-by-Step Guide
1. **Add the i18n Translation Keys**: Open the i18n JSON file containing the translations (/public/locales). For example, if using English, open the /en/translation.json file. Add a new key-value pair under the "faq" section for the new question and its answer. Use the format "q3": { "q": "Your question here", "a": "Your answer here" }.
```json
"faq": {
  "title": "Frequently Asked Questions",
  "questions": {
    "q1": {
      "q": "- How can I add new participants after generating the questionnaires?",
      "a": {
        "a1": "If you forgot to add any participant to the team, don't worry, you can backtrack and follow the next process:",
        "a2": "Click on Reset Phase, this will allow you to continue adding members to the team.",
        "a3": "Once you have finished adding participants, you can regenerate the questionnaires by clicking on Create Questionnaires."
      }
    },
    "q2": {
      "q": "- How can I change my password?",
      "a": "You can access My Account directly, where you'll be able to update your password. If you forget your password, you can reset it at the login screen by clicking on Forgot password?. Then, you'll receive an email to set a new password."
    },
    "q3": {
      "q": "Your question here",
      "a": "Your answer here."
    }
  }
}
```
2. **Open the FAQ Page File**: Navigate to the src/app/home/faq/page.tsx file in your project directory.
3. **Add a New Accordion Item**: Copy one of the existing <CustomAccordionItem> components and paste it below the last one. Update the title prop to specify the question title and the tkey value of the answer (keys in the JSON files). For example:
```html
  <CustomAccordionItem title="faq.questions.q3.q">
    <T tkey="faq.questions.q3.a" />
  </CustomAccordionItem>
```
4. **Save Changes**: Save the modified page.tsx file and the updated i18n JSON file.

## Uploading data from CSV

You can upload a CSV file in order to generate a report manually. This means, loading one row into _Results_ table in DB so data must be set properly to adjust table's structure, which contains a JSON file with all needed data for generating graph nodes and links.

### Assessment
The CSV file must contain the assessment logic: 
- **Influence**: Users assessing other users. You must add all combinations of couples and add ratings for each question.
- **Leaders/Products**: Users assessing leaders/products with some rating, but also leaders/products must rate users with a 0 score for all questions.

Logic for calculating influence grade and interaction grade is set in code.

### CSV file structure
Must contain these headers:
```csv
evaluator_id,evaluator_name,evaluated_id,evaluated_name,rating1,weight1,rating2,weight2,rating3,weight3
```

This is an example of 5 users rating 5 leaders:
```csv
evaluator_id,evaluator_name,evaluated_id,evaluated_name,rating1,weight1,rating2,weight2,rating3,weight3
1,user1,6,leader1,5,0.5,3,0.5,7,0.5
1,user1,7,leader2,8,0.5,4,0.5,6,0.5
1,user1,8,leader3,9,0.5,2,0.5,8,0.5
1,user1,9,leader4,3,0.5,5,0.5,7,0.5
1,user1,10,leader5,4,0.5,6,0.5,9,0.5
2,user2,6,leader1,2,0.5,9,0.5,4,0.5
2,user2,7,leader2,3,0.5,7,0.5,8,0.5
2,user2,8,leader3,5,0.5,2,0.5,6,0.5
2,user2,9,leader4,8,0.5,4,0.5,7,0.5
2,user2,10,leader5,6,0.5,3,0.5,5,0.5
3,user3,6,leader1,9,0.5,4,0.5,8,0.5
3,user3,7,leader2,2,0.5,6,0.5,3,0.5
3,user3,8,leader3,5,0.5,7,0.5,6,0.5
3,user3,9,leader4,8,0.5,2,0.5,5,0.5
3,user3,10,leader5,3,0.5,9,0.5,4,0.5
4,user4,6,leader1,7,0.5,6,0.5,5,0.5
4,user4,7,leader2,4,0.5,8,0.5,9,0.5
4,user4,8,leader3,2,0.5,5,0.5,7,0.5
4,user4,9,leader4,6,0.5,3,0.5,2,0.5
4,user4,10,leader5,9,0.5,4,0.5,6,0.5
5,user5,6,leader1,5,0.5,8,0.5,6,0.5
5,user5,7,leader2,7,0.5,3,0.5,2,0.5
5,user5,8,leader3,4,0.5,9,0.5,5,0.5
5,user5,9,leader4,2,0.5,6,0.5,3,0.5
5,user5,10,leader5,8,0.5,7,0.5,4,0.5
6,leader1,1,user1,0,0.5,0,0.5,0,0.5
6,leader1,2,user2,0,0.5,0,0.5,0,0.5
6,leader1,3,user3,0,0.5,0,0.5,0,0.5
6,leader1,4,user4,0,0.5,0,0.5,0,0.5
6,leader1,5,user5,0,0.5,0,0.5,0,0.5
7,leader2,1,user1,0,0.5,0,0.5,0,0.5
7,leader2,2,user2,0,0.5,0,0.5,0,0.5
7,leader2,3,user3,0,0.5,0,0.5,0,0.5
7,leader2,4,user4,0,0.5,0,0.5,0,0.5
7,leader2,5,user5,0,0.5,0,0.5,0,0.5
8,leader3,1,user1,0,0.5,0,0.5,0,0.5
8,leader3,2,user2,0,0.5,0,0.5,0,0.5
8,leader3,3,user3,0,0.5,0,0.5,0,0.5
8,leader3,4,user4,0,0.5,0,0.5,0,0.5
8,leader3,5,user5,0,0.5,0,0.5,0,0.5
9,leader4,1,user1,0,0.5,0,0.5,0,0.5
9,leader4,2,user2,0,0.5,0,0.5,0,0.5
9,leader4,3,user3,0,0.5,0,0.5,0,0.5
9,leader4,4,user4,0,0.5,0,0.5,0,0.5
9,leader4,5,user5,0,0.5,0,0.5,0,0.5
10,leader5,1,user1,0,0.5,0,0.5,0,0.5
10,leader5,2,user2,0,0.5,0,0.5,0,0.5
10,leader5,3,user3,0,0.5,0,0.5,0,0.5
10,leader5,4,user4,0,0.5,0,0.5,0,0.5
10,leader5,5,user5,0,0.5,0,0.5,0,0.5
```

## Replacing example results
Example reports are stored in the _example_results_ view. If you want to change the existing examples or add more, you need to update the view through the SQL Editor in Supabase. Follow these steps:

1. Access the SQL Editor in Supabase and copy and paste the following code:
```sql
CREATE OR REPLACE VIEW
  public.example_results as
SELECT
  results.id,
  results.result,
  results.report_name
FROM
  results
WHERE
  results.id = '1713698503619'
  OR results.id = '1714079302998'
  OR results.id = '1713448772441';
```

2. If you want to change the current example reports, update the **results.id** in the WHERE clause. 
3. If you want to add a new result, simply add another OR condition with the new results.id in the WHERE clause. For example:
```sql
CREATE OR REPLACE VIEW
  public.example_results as
SELECT
  results.id,
  results.result,
  results.report_name
FROM
  results
WHERE
  results.id = '1713698503619'
  OR results.id = '1714079302998'
  OR results.id = '1713448772441'
  OR results.id = 'NEW ID';
```
4. If you want to remove a result, just erase it from the WHERE clause.
5. For updating the name of the report that is shown as an example, you can run this code where you need to specify the new name and also the ID for that specific report:
```sql
UPDATE results
SET report_name='NEW REPORT NAME'
WHERE id = 'REPORT ID'
```

## Editing email content

To update the content of the email sent to users, follow these steps:

1. Locate the file containing the configuration and content of the email which can be found at _src/app/api/send-email/route.ts_. If you want to update the email that is sent when a user activates a trial, then, you need to change this file: _src/app/api/update-trial/route.ts_.
2. Within this file, there is a block of code that defines the subjects (**subject**) and HTML bodies (**html**) of the email in different languages (English, Spanish, and Czech). This block is located within the POST function.
3. Inside the POST function, you'll see different sections for each language, handled by an if-else structure. This is where you can update the email text.
```ts
if (lang == 2) {
	// Czech language
	subject = "Dotazník MySurface";
	html = `<h2>Dobrý den ${name},</h2>
	<p>Dotazník, který vám byl přidělen, můžete vyplnit kliknutím <a href="${url}">ZDE</a>. Prosím, vyplňte jej co nejdříve.</p>
	<p>S pozdravem,</p>
	<p><i>Team MySurface</i></p>`;
} else if (lang == 3) {
	// Spanish language
	subject = "Cuestionario MySurface";
	html = `<h2>Hola ${name},</h2>
	<p>Puedes rellenar el cuestionario que se te ha asignado haciendo clic <a href="${url}">AQUÍ</a>. Por favor, complétalo lo antes posible.</p>
	<p>Saludos,</p>
	<p><i>Equipo de MySurface</i></p>`;
} else {
	// English language
	subject = "MySurface questionnaire";
	html = `<h2>Hello ${name},</h2>
	<p>You can fill out the questionnaire assigned to you by clicking <a href="${url}">HERE</a>. Please complete it as soon as possible.</p>
	<p>Best regards,</p>
	<p><i>The MySurface Team</i></p>`;
}
```

## Update subscription
If you just want to update the **expiration_date**, you can run this code where you need to change the **user_id** and set the **interval** you want:
```sql
UPDATE billings
SET expiration_date = CURRENT_TIMESTAMP + INTERVAL '30 days'
WHERE user_id = 'USER_ID';
```

If you want to update subscriptions properly:

### Lifetime
When setting a subscription to _lifetime_ triggers will automatically set **expiration_date** to _NULL_, **updated_at** to _current time_ and **status** to _active_. 
So you just need to manually change the value of the **subscription** to _lifetime_ through Supabase interface in Table Editor or run the next command, setting the value of **user_id**:
```sql
UPDATE billings
SET subscription = 'lifetime'
WHERE user_id = 'USER_ID';
```

### Yearly
When setting a subscription to _yearly_ it is needed to run a function to update the **expiration_date** correctly. You'll need to add the user_id (_auth.users_ table) and Stripe session_id and customer_id (can be set to _NULL_ if there is no such information).
```sql
SELECT update_billing_yearly('user_id', 'stripe_session_id', 'stripe_customer_id');
```

### Trial
When setting a subscription to _trial_ it is needed to run a function to update the **expiration_date** correctly and also to set isTrialUsed to _TRUE_. You'll need to add the user_id.
```sql
SELECT update_billing_trial('user_id');
```

### None
When setting a subscription to _none_ triggers will automatically set **updated_at** to _current time_ and **status** to _inactive_. Other fields won't be updated, just in case that information is needed in the future.
So you just need to manually change the value of the **subscription** to _none_ through Supabase interface in Table Editor or run the next command, setting the value of **user_id**:
```sql
UPDATE billings
SET subscription = 'none'
WHERE user_id = 'USER_ID';
```

## Change icons
Icons are added through different React libraries. 
1. Check the file where the icon set to be changed is located. For **side menu** _/src/components/home/dashboard_navbar.tsx_ and **profile menu** _/src/components/home/topbar.tsx_.
2. Browse [React Icons](https://react-icons.github.io/react-icons/) and select a new one. When opening an icon, it displays the needed import for React that you need to **copy and paste** it at the top of the _.tsx_ file you are about to edit. It looks like this:
```ts
import { FaHome } from "react-icons/fa";
```
3. Locate the exact icon that you want to replace. It is possibly located inside a **Link** tag, like this where the actual icon is called _GoHome_:
```ts
<Link
	onClick={handleLinkClick}
	href="/home"
	className="hover:font-bold transition-all duration-200 ease-linear flex items-center gap-x-2 uppercase"
>
	<GoHome className="h-6 w-6" />
	<T tkey="navbar.home" />
</Link>
```
4. Replace the name of the icon with the new one that you have already imported. In this example, the new icon is called _FaHome_:
```ts
<Link
	onClick={handleLinkClick}
	href="/home"
	className="hover:font-bold transition-all duration-200 ease-linear flex items-center gap-x-2 uppercase"
>
	<FaHome className="h-6 w-6" />
	<T tkey="navbar.home" />
</Link>
```
5. Finally, you need to locate and remove the import of the previous icon. It should look something like this:
```ts
import { GoHome } from "react-icons/go";
```
