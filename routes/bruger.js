import express from 'express'

const router = express.Router()

import {getAllUsers, getSingleUser, createUser} from '../controllers/bruger'