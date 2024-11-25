import { fetchActions, fetchServices } from "@/app/db/sql";
import { Action, Service } from "@/app/lib/definitions";
import { useQuery } from "@tanstack/react-query";


export default async function NewTaskForm() {
  const servicesPromise = fetchServices();
  const actionsPromise = fetchActions();
  const [services, actions] = await Promise.all([servicesPromise, actionsPromise]);

  return (
    <form action="#" className="new-task-form">
      <div className="form-field">
        <label htmlFor="service">Service</label>
        <select name="service" id="service">
          <option value="" disabled>
            Select a service
          </option>

          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-field">
        <label htmlFor="link">Link</label>
        <input type="text" name="link" />
      </div>

      <div className="form-field">
        <label htmlFor="action">Action</label>
        <select name="action" id="action">
          <option value="" disabled>
            Select an action
          </option>

          {actions.map((action) => (
            <option key={action.id} value={action.id}>
              {action.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-field">
        <label htmlFor="price">Price</label>
        <input type="number" name="price" step="0.01" defaultValue="0.01" />
      </div>

      <div className="form-field">
        <label htmlFor="count">Count</label>
        <input type="number" name="count" step="1" defaultValue="1000" />
      </div>

      <button type="submit" className="submit-btn">Create</button>
    </form>
  )
}