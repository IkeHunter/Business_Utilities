/**
 * @fileoverview Manager for the monitor model.
 */
import EventManager from "../event/event";
import { UserType } from "../core/models/user/utils/user.types";
import Monitor from "./models/model";

import {
  MonitorPromiseOrNull,
  MonitorOrNull,
  MonitorType,
  MonitorDetailsPromise,
} from "./models/types";
import User from "src/core/models/user/user.model";

export default class MonitorManager {
  private static instance: MonitorManager = new MonitorManager();

  private constructor() {}

  /**
   * Parse data to create a monitor.
   *
   * @param data The data to parse.
   * @returns The parsed data.
   */
  public static async parseData(data: any) {
    let payload = {
      projectId: data.projectId,
      url: data.url || "",
      users: data.users || [],
      title: data.title || "",
    };

    return payload;
  }
  /**
   * Create a monitor.
   *
   * @param projectId The id of the project the monitor belongs to.
   * @param url The url to monitor.
   * @param users The users to notify when the monitor goes offline.
   * @param title The title of the monitor.
   * @returns The created monitor.
   */
  static async createMonitor(data: any) {
    let payload = await this.parseData(data);

    // TODO: Verify project exists
    // if (!payload.project) throw new Error("No project provided");
    // if (!payload.agency) throw new Error("No agency provided");

    let monitor = Monitor.create(payload)
      .then((monitor: any) => {
        return monitor;
      })
      .catch((err: any) => {
        console.log(err);
        throw err;
      });

    return monitor;
  }

  /**
   * Update a monitor.
   *
   * @param id The id of the monitor to update.
   * @param payload The payload to update the monitor with.
   * @returns The updated monitor.
   */
  static async updateMonitor(id: string, payload: any) {
    payload = await this.parseData(payload);

    let update = Monitor.findOneAndUpdate({ _id: id }, payload, { new: true })
      .then((monitor: any) => {
        return monitor;
      })
      .catch((err: any) => {
        console.log(err);
        throw err;
      });

    return update;
  }

  /**
   * Get a monitor.
   *
   * @param id The id of the monitor to get.
   * @returns The monitor.
   */
  static async getMonitor(id: string): MonitorPromiseOrNull {
    let monitor: MonitorOrNull = await Monitor.findById(id);

    if (!monitor) return null;
    return monitor;
  }

  /**
   * Get all monitors.
   *
   * @returns All monitors.
   */
  static async getMonitors() {
    let monitors = await Monitor.find({});

    if (!monitors) return [];
    return monitors;
  }

  /**
   * Delete a monitor.
   *
   * @param id The id of the monitor to delete.
   * @returns Boolean, whether deletion was successful.
   */
  static async deleteMonitor(id: string) {
    let monitor = await Monitor.findOne({ _id: id });

    if (!monitor) return false;
    let status = monitor
      .deleteOne()
      .then(() => {
        return true;
      })
      .catch((err: any) => {
        console.log(err);
        throw err;
      });

    return status;
  }

  /**
   * Search for monitors.
   *
   * @param query The query to search for.
   * @returns The monitors that match the query.
   */
  static async searchMonitors(query: any) {
    let filters = {};

    filters = query.url ? { ...filters, url: query.url } : filters;
    filters = query.title ? { ...filters, title: query.title } : filters;

    let monitors = await Monitor.find(filters);

    if (query.userId) {
      monitors = monitors.filter((monitor: any) => {
        return monitor.users.some((user: any) => {
          return user.userId === query.userId;
        });
      });
    }

    if (query.projectId) {
      monitors = monitors.filter((monitor: any) => {
        return monitor.projectId === query.projectId;
      });
    }

    if (!monitors) return [];
    return monitors;
  }
  /**
   * Check if a user has permission to access a monitor.
   *
   *
   * @param user The user to check.
   * @param monitor The monitor to check.
   * @returns Boolean, whether the user has permission.
   */
  static async userHasPermission(user: UserType, monitor: MonitorType) {
    return user.projectIds?.includes(monitor.projectId);
  }

  /**
   * Generate monitor metrics.
   *
   * @param monitor The monitor to generate metrics for.
   * @returns MonitorDetails, The generated metrics.
   */
  static async generateMetrics(monitor: MonitorType, dayRange: number = 30): MonitorDetailsPromise {
    let details = {
      totalDowntimeMinutes: 0,
      totalUptimeMinutes: 0,
      totalEvents: 0,
      totalDowntimeEvents: 0,
      averageResponseTime: 0,
    };

    const now = new Date();
    const totalMinutes = dayRange * 24 * 60;
    const start = new Date(now.getTime() - totalMinutes * 60 * 1000);

    const events = await EventManager.getEventsInRange(monitor._id, start, now);

    details.totalDowntimeMinutes = await EventManager.getDowntimeFromEvents(events);
    details.totalUptimeMinutes = totalMinutes - details.totalDowntimeMinutes;
    details.totalEvents = events.length;
    let downtimeEvents = await EventManager.filterDowntimeEvents(events);
    details.totalDowntimeEvents = downtimeEvents.length;
    details.averageResponseTime = await EventManager.getAverageResponseTimeFromEvents(events);

    return { ...monitor, ...details };
  }

  /**
   * Handle a monitor going down.
   *
   * @param monitor The monitor that went down.
   * @param statusCode The status code of the monitor.
   * @param error The error message of the monitor.
   * @returns Boolean, whether the monitor was handled.
   */
  static async handleMonitorDown(monitor: MonitorType, statusCode: number, error: string) {
    monitor.online = false;
    let event = await EventManager.registerDownEvent(monitor._id, statusCode, error);

    if (!event) return false;

    monitor.users.forEach(async (user: any) => {
      const userObj = User.findById(user.userId);
      if (userObj !== undefined) {
        let message = `Monitor ${monitor.title} is down. Status code: ${statusCode}`;
        console.log("sending email: ", message);
      }
    });
  }
}
