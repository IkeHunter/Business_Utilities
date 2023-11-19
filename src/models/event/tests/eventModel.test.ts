/**
 * @fileoverview Tests for the Event model.
 */
import Agency from "../../agency/agency.model";
import Monitor from "../../monitor/monitor.model";
import Event from "../event.model";
import Project from "../../project/project.model";

/**
 * Tests for the Event model.
 */
describe("Event", () => {
  let monitor: any;
  let eventData: any;

  /**
   * Create a monitor before each test.
   */
  beforeEach(async () => {
    const agency = {
      agencyId: "456",
      name: "Test agency",
    };
    const project = {
      agency: agency,
      projectId: "123",
      name: "Test Project",
    };
    
    let payload = {
      project: project,
      agency: agency,
      url: "https://example.com",
      users: [],
      statusCode: 200,
      title: "Example",
    };

    await Agency.create(agency);
    await Project.create(project);
    monitor = await Monitor.create(payload);

    eventData = {
      monitorId: monitor._id,
      statusCode: 200,
      online: true,
      timestamp: new Date(),
    };
  });

  /**
   * Event models should be able to be created.
   */
  it("should add an event", async () => {
    const event = { ...eventData };

    await new Event(event).save();

    const events = await Event.find({});

    expect(events.length).toEqual(1);
  });

  /**
   * Event models should be able to be updated.
   */
  it("should update an event", async () => {
    const event = { ...eventData };

    await new Event(event).save();

    const updatedEvent = {
      monitorId: monitor._id,
      statusCode: 200,
      online: false,
      timestamp: new Date(),
    };

    await Event.updateOne(updatedEvent);

    const events = await Event.find({});

    expect(events[0].online).toEqual(false);
  });

  /**
   * Event models should be able to be retrieved.
   */
  it("should get an event", async () => {
    const event = { ...eventData };

    await new Event(event).save();

    const events = await Event.find({});

    expect(events.length).toEqual(1);
  });

  /**
   * Event models should be able to be deleted.
   */
  it("should delete an event", async () => {
    const event = { ...eventData };

    let obj = await new Event(event).save();

    await Event.deleteOne({ _id: obj._id });

    const events = await Event.find({});

    expect(events.length).toEqual(0);
  });
});
