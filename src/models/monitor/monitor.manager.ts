/**
 * @fileoverview Manager for the monitor model.
 */
import Agency from "../agency/agency.model";
import Project from "../project/project.model";
import UserManager from "../user/user.manager";
import { UserOrNull, UserType } from "../user/utils/user.types";
import Monitor from "./monitor.model";
import { CreateMonitorError, CreateMonitorErrorTypes as errors } from "./utils/monitor.errors";
import {
  MonitorPromise,
  MonitorPromiseOrNull,
  MonitorOrNull,
  MonitorType,
} from "./utils/monitor.types";

export default class MonitorManager {
  private static instance: MonitorManager = new MonitorManager();

  private constructor() {}

  /**
   * Parse data to create a monitor.
   *
   * @param data The data to parse.
   * @returns The parsed data.
   */
  private async parseData(data: any) {
    let payload = {
      project: null as any,
      // agency: null as any,
      url: data.url || "",
      users: data.users || [],
      title: data.title || "",
    };

    if (data.project) {
      let project = await Project.findOne({ projectId: data.project.projectId });

      if (project) payload.project = project;
    }

    // if (data.agency) {
    //   let agency = await Agency.findOne({ agencyId: data.agency.agencyId });

    //   if (agency) payload.agency = agency;
    // }

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
    let payload = await this.instance.parseData(data);

    if (!payload.project) throw new Error("No project provided");
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

  // public static async createMonitorFromObject(data: any): MonitorPromise {
  //   let payload = await this.instance.parseData(data);

  //   if (!payload.project) throw new Error("No project provided");
  //   if (!payload.agency) throw new Error("No agency provided");

  //   let monitor = Monitor.create(payload)
  //     .then((monitor: any) => {
  //       return monitor;
  //     })
  //     .catch((err: any) => {
  //       console.log(err);
  //       throw err;
  //     });

  //   return monitor;
  // }

  /**
   * Update a monitor.
   *
   * @param id The id of the monitor to update.
   * @param payload The payload to update the monitor with.
   * @returns The updated monitor.
   */
  static async updateMonitor(id: string, payload: any) {
    payload = await this.instance.parseData(payload);

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
    let monitor: MonitorOrNull = await Monitor.findOne({ _id: id });

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
        // return false;
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

    // filters = query.projectId ? { ...filters, projectId: query.projectId } : filters;
    filters = query.url ? { ...filters, url: query.url } : filters;
    filters = query.title ? { ...filters, title: query.title } : filters;
    // filters = query.userId ? {...filters, users: [{userId: query.userId}]} : filters;

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
        return monitor.project.projectId === query.projectId;
      });
    }
    
    // if (query.agencyId) {
    //   monitors = monitors.filter((monitor: any) => {
    //     return monitor.agency.agencyId === query.agencyId;
    //   });
    // }

    if (!monitors) return [];
    return monitors;
  }

  static async userHasPermission(user: UserType, monitor: MonitorType) {
    return (
      // user.agencies.includes(monitor.agency.agencyId) &&
      user.projects.includes(monitor.project.projectId)
    );
  }
}
