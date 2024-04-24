# NestJS Movie Application API

Welcome to the NestJS Movie Application API! This API provides endpoints for user authentication, movie management, and comment interaction.                          env sample{

PORT=3005
POSTGRES_DB_HOST=''
POSTGRES_DB_PORT=''
POSTGRES_DB_USER=''
POSTGRES_DB_PASSWORD=''
DB_NAME=''
NODE_ENV='development'
TOKEN_EXPIRATION_TIME=''
TOKEN_SECRET=''
REDIS_SERVER_URL='redis://127.0.0.1:6379'
}

## Table of Contents

- [User Authentication](#user-authentication)
  - [User Registration](#1-user-registration)
  - [User Login](#2-user-login)
  - [Confirm 2FA](#3-confirm-2fa)

- [Movie Management](#movie-management)
  - [Create a Movie](#4-create-a-movie)
  - [Get Movies](#5-get-movies)
  - [Get Movie by Title](#6-get-movie-by-title)
  - [Get Movie by Category](#7-get-movie-by-category)
  - [Update a Movie](#8-update-a-movie)

- [Comment Management](#comment-management)
  - [Create Comment](#9-create-comment)
  - [Get Movie Comments](#10-get-movie-comments)

- [Movie Interaction](#movie-interaction)
  - [Like a Movie](#11-like-a-movie)
  - [Dislike a Movie](#12-dislike-a-movie)
  - [Favorite a Movie](#13-favorite-a-movie)
  - [Get Favorite Movies](#14-get-favorite-movies)
  - [Delete Favorite Movie](#15-delete-favorite-movie)

---
