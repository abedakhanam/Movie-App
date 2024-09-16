3. Common Workflow

   While developing: Run npm run dev to use Nodemon and have automatic restarts on changes.
   When ready for production: Run npm run build to compile TypeScript to JavaScript, and then npm run start to launch the server.

{
"username": "john_doe",
"email": "john@example.com",
"password": "password123"
}

## run code

npx tsc --build
npm run dev

#### Initialize a new Node.js project

npm init -y

#### Install necessary packages

npm install express
npm i -D typescript
sequelize pg pg-hstore dotenv jsonwebtoken bcryptjs
npm i -D nodemon
npm i -D ts-node

#### Install TypeScript and types for Node.js and Express

npm install --save-dev typescript @types/node @types/express @types/jsonwebtoken @types/bcryptjs

#### Initialize TypeScript configuration

npx tsc --init

#### build and run before

npx tsc --build
node ./dist/index.js
