let express = require("express");
let { graphqlHTTP } = require("express-graphql");
let { buildSchema, print } = require("graphql");
let fs = require("fs");

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(":memory:");

// GraphQL schema
let schema = buildSchema(`
  type Query {
    course(id: String!): Course
    courseComplex(params: CourseParams): Course
    courseComplexMultiple(params: [CourseParams]): [Course]
    courses(topic: String): [Course]
    value(input: String): String
  }
  type Mutation {
    updateCourseTopic(id: Int!, topic: String!): Course
  }
  type Subscription {
    courses(topic: String): [Course]
  }
  input CourseParams {
    id: Int!
    topic: String!
  }
  type Course {
    id: Int
    title: String
    author: String
    description: String
    topic: String
    url: String
  }
`);

db.run(
  "CREATE TABLE courses (id INT, title TEXT, author TEXT, description TEXT, topic TEXT, url TEXT)",
  function () {
    const insertQuery =
      "INSERT INTO courses (id, title, author, description, topic, url) VALUES (?, ?, ?, ?, ?, ?)";
    const coursesData = [
      {
        id: 1,
        title: "The Complete Node.js Developer Course",
        author: "Andrew Mead, Rob Percival",
        description:
          "Learn Node.js by building real-world applications with Node, Express, MongoDB, Mocha, and more!",
        topic: "Node.js",
        url: "https://codingthesmartway.com/courses/nodejs/",
      },
      {
        id: 2,
        title: "Node.js, Express & MongoDB Dev to Deployment",
        author: "Brad Traversy",
        description:
          "Learn by example building & deploying real-world Node.js applications from absolute scratch",
        topic: "Node.js",
        url: "https://codingthesmartway.com/courses/nodejs-express-mongodb/",
      },
      {
        id: 3,
        title: "JavaScript: Understanding The Weird Parts",
        author: "Anthony Alicea",
        description:
          "An advanced JavaScript course for everyone! Scope, closures, prototypes, this, build your own framework, and more.",
        topic: "JavaScript",
        url: "https://codingthesmartway.com/courses/understand-javascript/",
      },
    ];

    coursesData.forEach((course) => {
      db.run(insertQuery, [
        course.id,
        course.title,
        course.author,
        course.description,
        course.topic,
        course.url,
      ]);
    });
  }
);

// Resolvers
let getCourse = function (args) {
  const id = args.id;
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM courses WHERE id = ${id}`, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

let getCourseComplex = function (args) {
  let params = args.params;
  return coursesData[0];
};
let getCourseComplexMultiple = function (args) {
  return [...coursesData];
};
let getCourses = function (args) {
  if (args.topic) {
    let topic = args.topic;
    return coursesData.filter((course) => course.topic === topic);
  } else {
    return coursesData;
  }
};
let updateCourseTopic = function ({ id, topic }) {
  coursesData.map((course) => {
    if (course.id === id) {
      course.topic = topic;
      return course;
    }
  });
  return coursesData.filter((course) => course.id === id)[0];
};
let root = {
  course: getCourse,
  courseComplex: getCourseComplex,
  courseComplexMultiple: getCourseComplexMultiple,
  courses: getCourses,
  updateCourseTopic: updateCourseTopic,
  value: ({ input }) => {
    return fs.readFileSync(input).toString();
  },
};

// Create an express server and a GraphQL endpoint
let app = express();

app.use((req, res, next) => {
  if (process.env.AUTH != "1") {
    return next();
  }

  if (
    req.headers.authorization ==
    "Bearer ed62b1b3a68594c9f9a2a6a1a87ba14730a0457b"
  ) {
    next();
  } else {
    res.end("Unauthorized");
  }

  next();
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
    extensions: async (info) => console.log(print(info.document)),
  })
);

app.get("/.env", (req, res) => {
  res.end("SECRET_TOKEN=ed62b1b3a68594c9f9a2a6a1a87ba14730a0457b");
});

app.listen(3001, () =>
  console.log("Express GraphQL Server Now Running On localhost:3001/graphql")
);
