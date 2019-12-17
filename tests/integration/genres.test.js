const request = require("supertest");
const { Genre } = require("../../models/genre");
const mongoose = require("mongoose");
const { User } = require("../../models/user");

let server;

describe("/api/genres", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    server.close();
    await Genre.remove({});
  });

  describe("GET /", () => {
    it("should return all genres", async () => {
      const genres = [{ name: "genre1" }, { name: "genre2" }];

      await Genre.collection.insertMany(genres);

      const res = await request(server).get("/genres");

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some(g => g.name === "genre1")).toBeTruthy();
      expect(res.body.some(g => g.name === "genre2")).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    it("should return a genre if valid id is passed", async () => {
      const genre = new Genre({ name: "genre1" });
      await genre.save();

      const res = await request(server).get("/genres/" + genre._id);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", genre.name);
    });

    it("should return 404 if invalid id is passed", async () => {
      const res = await request(server).get("/genres/1");

      expect(res.status).toBe(404);
    });

    it("should return 404 if no genre with the given id exists", async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(server).get("/genres/" + id);

      expect(res.status).toBe(404);
    });
  });

  describe("POST / ", () => {
    it("should return 401 if client is not logged in", async () => {
      const res = await request(server)
        .post("/genres")
        .send({ name: "genre1" });
      expect(res.status).toBe(401);
    });

    it("should return 400 (bad request) if genre is less than 5 chars", async () => {
      const token = new User().generateAuthToken();

      const res = await request(server)
        .post("/genres")
        .set("x-auth-token", token)
        .send({ name: "1234" }); //Name should be more than 5 chars
      expect(res.status).toBe(400);
    });

    it("should return 400 (bad request) if genre is more than 50 chars", async () => {
      const token = new User().generateAuthToken();
      const longName = new Array(52).join("a"); //Use an array to generate a long string

      const res = await request(server)
        .post("/genres")
        .set("x-auth-token", token)
        .send({ name: this.longName }); //Name should be more than 5 chars
      expect(res.status).toBe(400);
    });

    it("should save the genre if it is valid", async () => {
      const token = new User().generateAuthToken();

      const res = await request(server)
        .post("/genres")
        .set("x-auth-token", token)
        .send({ name: "genre1" }); //Name should be more than 5 chars
      const genre = Genre.find({ name: "genre1" });

      expect(genre).not.toBeNull;
    });

    it("should return the genre if it is valid", async () => {
      const token = new User().generateAuthToken();

      const res = await request(server)
        .post("/genres")
        .set("x-auth-token", token)
        .send({ name: "genre1" }); //Name should be more than 5 chars

      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "genre1");
    });
  });
});
