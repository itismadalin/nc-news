process.env.NODE_ENV = 'test';
const connection = require('../db/connection');
const chai = require('chai');
const {expect} = chai;
const app = require('../app.js');
const request = require('supertest');

