# Serverless Random Quote Generator (AWS Deployment)

This project is a full-stack, serverless web application that displays random quotes and allows users to submit their own. It is designed to be deployed manually using the AWS Management Console, making it a great way to learn how the core services connect.

![Architecture Diagram](random%20quote.jpg) <!-- Optional: Add a link to an architecture diagram -->

## Core Technologies

-   **Frontend:** HTML, CSS, Vanilla JavaScript
-   **Backend:** Python
-   **AWS Services:**
    -   **AWS Lambda:** For running the backend Python code without managing servers.
    -   **Amazon API Gateway:** To create a public REST API endpoint for the frontend.
    -   **Amazon DynamoDB:** A NoSQL database for persistently storing the quotes.
    -   **Amazon S3:** To host the static frontend website.
    -   **AWS IAM:** To manage permissions between services.

## Project Structure

```
.
├── backend/                  # Contains all backend code
│   ├── app.py                # The Lambda function handler
│   └── requirements.txt      # Python dependencies
├── frontend/                 # Contains all frontend assets
│   ├── index.html
│   ├── script.js
│   └── style.css
└── README.md                 # This file
```

## Deployment Instructions

Follow these steps to deploy the entire application to your AWS account using the AWS Management Console.

### Part 1: Deploy the Backend Infrastructure

#### Step 1.1: Create the DynamoDB Table

This will be our database to store quotes.

1.  Navigate to the **DynamoDB** service in the AWS Console.
2.  Click **Create table**.
3.  **Table name:** `Quotes`
4.  **Partition key:** `quoteId` (Type: `String`)
5.  Leave all other settings as default and click **Create table**.

#### Step 1.2: Create an IAM Role for Lambda

Our Lambda function needs permission to interact with other AWS services.

1.  Navigate to the **IAM** service.
2.  Go to **Roles** and click **Create role**.
3.  **Trusted entity type:** Select **AWS service**.
4.  **Use case:** Select **Lambda**. Click **Next**.
5.  On the "Add permissions" page, search for and add the policy `AWSLambdaBasicExecutionRole`.
6.  Click **Next**.
7.  **Role name:** `QuoteAppLambdaRole`.
8.  Click **Create role**.
9.  **Add DynamoDB Permissions:**
    -   Find and click on the `QuoteAppLambdaRole` you just created.
    -   Click the **Add permissions** dropdown and select **Create inline policy**.
    -   Select the **JSON** tab and paste the following policy. **Important:** Replace `YOUR_AWS_ACCOUNT_ID` and `YOUR_AWS_REGION` with your actual account ID and region.
    ```json
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "AllowDynamoDBActions",
                "Effect": "Allow",
                "Action": [
                    "dynamodb:Scan",
                    "dynamodb:PutItem"
                ],
                "Resource": "arn:aws:dynamodb:YOUR_AWS_REGION:YOUR_AWS_ACCOUNT_ID:table/Quotes"
            }
        ]
    }
    ```
    -   Click **Next**.
    -   **Policy name:** `DynamoDBQuotesTablePolicy`.
    -   Click **Create policy**.

#### Step 1.3: Create the Lambda Function

This is where our backend Python code will live.

1.  Navigate to the **AWS Lambda** service.
2.  Click **Create function**.
3.  Select **Author from scratch**.
4.  **Function name:** `QuoteApiFunction`.
5.  **Runtime:** Select **Python 3.9** (or newer).
6.  Expand **Change default execution role**, select **Use an existing role**, and choose the `QuoteAppLambdaRole` you created.
7.  Click **Create function**.
8.  **Add Code:**
    -   In the **Code source** editor, open the `lambda_function.py` file.
    -   Delete the existing boilerplate code.
    -   Copy the entire content of `backend/app.py` from this repository and paste it into the editor.
    -   Click the **Deploy** button to save your code.
9.  **Add Environment Variable:**
    -   Go to the **Configuration** tab, then **Environment variables**.
    -   Click **Edit**, then **Add environment variable**.
    -   **Key:** `TABLE_NAME`
    -   **Value:** `Quotes`
    -   Click **Save**.

#### Step 1.4: Create the API Gateway

This will create a public URL for our Lambda function.

1.  Navigate to the **API Gateway** service.
2.  Find the "REST API" box and click **Build**.
3.  Select **New API**.
4.  **API name:** `QuotesAPI`. Click **Create API**.
5.  **Create Resource:** With the `/` root selected, click **Actions** -> **Create Resource**. Name it `quotes`. Click **Create Resource**.
6.  **Create Methods:**
    -   With the `/quotes` resource selected, click **Actions** -> **Create Method**.
    -   Select **GET** from the dropdown and click the checkmark.
    -   **Integration type:** **Lambda Function**.
    -   Check **Use Lambda Proxy integration**.
    -   **Lambda Function:** Start typing `QuoteApiFunction` and select it.
    -   Click **Save**, then **OK** to grant permissions.
    -   Repeat this process to create a **POST** method for the `/quotes` resource.
7.  **Enable CORS:**
    -   With the `/quotes` resource selected, click **Actions** -> **Enable CORS**.
    -   Click the **Enable CORS and replace existing CORS headers** button.
8.  **Deploy API:**
    -   Click **Actions** -> **Deploy API**.
    -   **Deployment stage:** `[New Stage]`, Stage name: `prod`.
    -   Click **Deploy**.
9.  After deploying, you will see an **Invoke URL**. **Copy this URL!** This is your backend API endpoint.

---

### Part 2: Deploy the Frontend

#### Step 2.1: Configure the Frontend

1.  Open the `frontend/script.js` file in your code editor.
2.  Find the `API_BASE_URL` constant.
3.  Replace the placeholder string `<-- YOUR_API_GATEWAY_URL_HERE -->` with the **Invoke URL** you copied from API Gateway.
4.  Save the file.

#### Step 2.2: Create and Configure S3 Bucket

1.  Navigate to the **S3** service.
2.  **Create a bucket** with a globally unique name (e.g., `my-quote-app-frontend-12345`).
3.  In the **Permissions** tab of your bucket, **turn OFF "Block all public access"** and save the changes.
4.  Add a **Bucket policy** to make the content public. Replace `your-unique-bucket-name` with your actual bucket name.
    ```json
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "PublicReadGetObject",
                "Effect": "Allow",
                "Principal": "*",
                "Action": "s3:GetObject",
                "Resource": "arn:aws:s3:::your-unique-bucket-name/*"
            }
        ]
    }
    ```
5.  Go to the **Properties** tab, scroll to the bottom, and **Enable Static website hosting**. Set the **Index document** to `index.html`.
6.  **Copy the Bucket website endpoint URL**. This is your public website URL.

#### Step 2.3: Upload Frontend Files

1.  In your S3 bucket, click **Upload**.
2.  Upload the three files from the `frontend` directory: `index.html`, `style.css`, and your modified `script.js`.

---

## Usage

You're live! Open the **Bucket website endpoint URL** from the final S3 step in your browser to see your application in action.

## Cleaning Up

To avoid ongoing charges, delete the AWS resources when you are finished.

1.  **Delete the API Gateway**.
2.  **Delete the Lambda function**.
3.  **Delete the IAM Role** (`QuoteAppLambdaRole`).
4.  **Delete the DynamoDB table** (`Quotes`).
5.  **Empty and delete the S3 bucket**.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.