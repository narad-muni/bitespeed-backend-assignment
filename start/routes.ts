/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import IdenitfiesController from '#controllers/idenitfies_controller'
import router from '@adonisjs/core/services/router'

router.post('/identify', [IdenitfiesController])
