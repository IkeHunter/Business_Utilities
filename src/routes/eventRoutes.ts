import { Router } from 'express'
import { EventController } from 'src/controllers/eventsController'
import { isAuthenticated } from 'src/middleware'

const router = Router()

router.post('/', isAuthenticated, EventController.createEvent)
router.get('/:id', isAuthenticated, EventController.getEvent)
router.delete('/:id', isAuthenticated, EventController.deleteEvent)
router.get('/search', isAuthenticated, EventController.searchEvents)

// router.post("/register", isAuthenticated, EventController.registerEvent);

export const eventRoutes = router
