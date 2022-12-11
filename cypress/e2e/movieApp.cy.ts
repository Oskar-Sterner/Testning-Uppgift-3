import { IOmdbResponse } from "../../src/ts/models/IOmdbResponse";
const mockNoMovies: IOmdbResponse = { Search: [] };

const interceptMovies: IOmdbResponse = {
  Search: [
    {
      Title: "The Lord of the Rings: The Fellowship of the Ring",
      Year: "2001",
      imdbID: "tt0120737",
      Type: "movie",
      Poster: "https://m.media-amazon.com/images/M/MV5BN2EyZjM3NzUtNWUzMi00MTgxLWI0NTctMzY4M2VlOTdjZWRiXkEyXkFqcGdeQXVyNDUzOTQ5MjY@._V1_SX300.jpg"
    },
    {
      Title: "The Lord of the Rings: The Return of the King",
      Year: "2003",
      imdbID: "tt0167260",
      Type: "movie",
      Poster: "https://m.media-amazon.com/images/M/MV5BNzA5ZDNlZWMtM2NhNS00NDJjLTk4NDItYTRmY2EwMWZlMTY3XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg"
    },
    {
      Title: "The Lord of the Rings: The Two Towers",
      Year: "2002",
      imdbID: "tt0167261",
      Type: "movie",
      Poster: "https://m.media-amazon.com/images/M/MV5BZGMxZTdjZmYtMmE2Ni00ZTdkLWI5NTgtNjlmMjBiNzU2MmI5XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg"
    },
    {
      Title: "Lord of War",
      Year: "2005",
      imdbID: "tt0399295",
      Type: "movie",
      Poster: "https://m.media-amazon.com/images/M/MV5BMTYzZWE3MDAtZjZkMi00MzhlLTlhZDUtNmI2Zjg3OWVlZWI0XkEyXkFqcGdeQXVyNDk3NzU2MTQ@._V1_SX300.jpg"
    },
    {
      Title: "The Lord of the Rings: The Rings of Power",
      Year: "2022–",
      imdbID: "tt7631058",
      Type: "series",
      Poster: "https://m.media-amazon.com/images/M/MV5BNTg3NjcxYzgtYjljNC00Y2I2LWE3YmMtOTliZTkwYTE1MmZiXkEyXkFqcGdeQXVyNTY4NDc5MDE@._V1_SX300.jpg"
    },
  ],
};

beforeEach(() => {
  cy.visit("/");
});

describe("should test out movieApp", () => {
  
  it("should display content from API", () => {
    cy.get("#searchText").type("Star trek");
    cy.get("#search").click();

    cy.get("#movie-container:has(h3)").should("contain", "Star");
    cy.get("#movie-container > div").should("have.class", "movie");
    cy.get("#movie-container > div").should("have.length.above", 2);

    cy.get("#searchText").should("have.value", "Star trek");

    cy.get(".movie > img").should("have.length.above", 2);
    cy.get(".movie > h3").should("have.length.above", 2);
  });

  it("should display GET from mocked API", () => {
    cy.intercept("GET", "http://omdbapi.com/*", interceptMovies).as(
      "interceptMovies"
      );
    cy.get("#searchText").type("The Lord of the Rings");
    cy.get("#searchText").should("have.value", "The Lord of the Rings");
    cy.get("#search").click();

    cy.wait("@interceptMovies").its("request.url").should("contain", "Lord");

    cy.get(".movie > h3").should("have.length.above", 3);
    cy.get(".movie > img").should("have.length.above", 3);

    cy.get("#movie-container>div").should("have.length.above", 3);
    cy.get("#movie-container:has(h3)").should("contain", "The Lord of the Rings");
    cy.get("#movie-container>div").should("have.class", "movie");
  });

  it("should display GET from non mocked API", () => {
    cy.intercept("GET", "http://omdbapi.com/*", mockNoMovies).as(
      "mockNoMovies"
    );
    cy.get("#searchText").type("Lord of the rings");
    cy.get("#searchText").should("have.value", "Lord of the rings");
    cy.get("#search").click();

    cy.wait("@mockNoMovies").its("request.url").should("contain", "Lord");
    cy.get("#movie-container>div").should("have.length", 0);
    cy.get("p").contains("Inga sökresultat att visa");
  });

  it("should get error", () => {
    cy.get("#searchText").clear();
    cy.get("#search").click();
    cy.get("p").contains("Inga sökresultat att visa");
  });

  it("should get error due to non-eligible searchText", () => {
    let searchText: string = "^";

    cy.get("input").type(searchText).should("have.value", searchText);
    cy.get("#search").click();

    cy.get("#movie-container:first").contains("Inga sökresultat att visa");
  });

  it("should return interceptData", () => {
    let searchText: string = "Lord";

    cy.intercept("GET", "http://omdbapi.com/*", { interceptMovies }).as(
      "interceptMovies"
    );

    cy.get("input").type(searchText).should("have.value", searchText);
    cy.get("#search").click();

    cy.wait("@interceptMovies").its("request.url").should("contain", "=Lord");
  });
});