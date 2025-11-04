# 🚀 Serverless Random Quote Generator

![App Screenshot](Screenshot%202025-10-11%20222516.png) <!-- IMPORTANT: Add a screenshot of your app to an 'assets' folder and link it here -->

### A full-stack, serverless web application built on AWS that displays random quotes and allows users to submit their own. This project demonstrates a modern, scalable, and cost-effective cloud architecture.



---

## ✨ Key Features

-   **Dynamic Content:** Fetches and displays quotes from a persistent database.
-   **User Submissions:** A fully functional form allows users to add new quotes.
-   **Serverless Backend:** No servers to manage, scales automatically, and you only pay for what you use.
-   **Polished UI:** A clean, modern, and responsive user interface built with vanilla HTML, CSS, and JavaScript.
-   **Infrastructure as Code (Optional):** Includes an AWS SAM template for automated backend deployment.

---

## 🛠️ Tech Stack & Architecture

This project utilizes a modern serverless architecture on AWS.

![aws](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)
![python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![html5](https://img.shields.io/badge/HTML5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![css3](https://img.shields.io/badge/CSS3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![javascript](https://img.shields.io/badge/JavaScript-%23F7DF1E.svg?style=for-the-badge&logo=javascript&logoColor=black)

| Category      | Service / Technology                                                                                                  | Description                                                                 |
| :------------ | :-------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------- |
| **Frontend**  | ![html5] ![css3] ![javascript] <br/> **Amazon S3**                                                                     | A responsive single-page application hosted as a static website on S3.      |
| **Backend**   | ![python] <br/> **AWS Lambda**                                                                                        | Serverless function that contains the business logic for handling quotes.   |
| **API**       | **Amazon API Gateway**                                                                                                | Provides a secure, scalable REST API endpoint for the frontend to call.     |
| **Database**  | **Amazon DynamoDB**                                                                                                   | A fully managed NoSQL database for storing and retrieving quote data.       |
| **Security**  | **AWS IAM**                                                                                                           | Manages granular permissions between AWS services, ensuring least privilege. |
| **Automation**|                                                                                                | Defines and deploys the entire backend infrastructure as code.              |

---

![Architecture Diagram](random%20quote.jpg) <!-- Optional: Add a link to an architecture diagram -->

## 🚀 Getting Started

You can deploy this application to your own AWS account by following the setup instructions.

### Prerequisites

-   An AWS Account ([Free Tier available](https://aws.amazon.com/free/))
-   AWS CLI configured with your credentials (`aws configure`)
-   Node.js and npm (for local development, if desired)


###  cloning the Repository

```bash
git clone https://github.com/Ace12Anirudh/Random_quote_generator-powered-by-AWS.git
cd [Random_quote_generator-powered-by-AWS]
```

---

## ⚙️ Deployment Instructions (Manual Setup)

Follow these steps to deploy the application manually using the AWS Management Console.

### 🏛️ Part 1: Backend Setup

#### 1.1: Create DynamoDB Table
-   **Service:** DynamoDB
-   **Action:** Create table
-   **Table name:** `Quotes`
-   **Partition key:** `quoteId` (Type: `String`)

#### 1.2: Create IAM Role for Lambda
-   **Service:** IAM > Roles
-   **Action:** Create role
-   **Trusted entity:** AWS service > Lambda
-   **Permissions:** Attach `AWSLambdaBasicExecutionRole` policy.
-   **Role name:** `QuoteAppLambdaRole`
-   **Post-creation:** Add a custom inline policy to the role to allow it to read/write to the `Quotes` DynamoDB table.

#### 1.3: Create Lambda Function
-   **Service:** AWS Lambda
-   **Action:** Create function
-   **Function name:** `QuoteApiFunction`
-   **Runtime:** Python 3.9+
-   **Execution role:** Use the `QuoteAppLambdaRole` created above.
-   **Code:** Copy/paste the code from `backend/app.py`.
-   **Environment Variable:** Create a variable with Key: `TABLE_NAME` and Value: `Quotes`.

#### 1.4: Create API Gateway
-   **Service:** API Gateway
-   **Action:** Create a REST API.
-   **Resource:** Create a `/quotes` resource.
-   **Methods:** Create `GET` and `POST` methods under `/quotes`, integrating both with the `QuoteApiFunction` using **Lambda Proxy integration**.
-   **CORS:** Enable CORS on the `/quotes` resource.
-   **Deploy:** Deploy the API to a new stage named `prod`.
-   **➡️ Action:** **Copy the `Invoke URL`** after deployment.

### 🌐 Part 2: Frontend Setup

#### 2.1: Configure the Frontend
-   Open `frontend/script.js`.
-   Replace the placeholder `<-- YOUR_API_GATEWAY_URL_HERE -->` with the **Invoke URL** you copied from API Gateway.

#### 2.2: Create and Configure S3 Bucket
-   **Service:** S3
-   **Action:** Create a new bucket with a globally unique name.
-   **Permissions:** Turn OFF "Block all public access" and add a bucket policy to allow public `s3:GetObject` actions.
-   **Properties:** Enable **Static website hosting** and set the index document to `index.html`.
-   **➡️ Action:** **Copy the `Bucket website endpoint` URL**.

#### 2.3: Upload Frontend Files
-   Upload the contents of the `/frontend` directory (`index.html`, `style.css`, and your modified `script.js`) to the S3 bucket.

### ✅ Done!
Your application is now live at the **S3 Bucket website endpoint URL**.

---

## 🧹 Cleaning Up

To avoid ongoing AWS charges, remember to delete the resources you created.

1.  Delete the **API Gateway**.
2.  Delete the **Lambda function**.
3.  Delete the **IAM Role**.
4.  Delete the **DynamoDB table**.
5.  Empty and delete the **S3 bucket**.

