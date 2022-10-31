import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Employee from 'App/Models/Employee'

export default class EmployeesController {
  public async index({ response }: HttpContextContract) {
    const employees = await Employee.query()
      .select(['employees.id', 'name', 'email', 'address', 'phone', 'role', 'role_id'])
      .join('roles', 'employees.role_id', '=', 'roles.id')

    if (employees) {
      return response.json(employees)
    } else {
      return response.status(500).json({ message: 'There was an error' })
    }
  }

  public async store({ request, response }: HttpContextContract) {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { name, email, address, phone, role_id } = request.body() as unknown as Employee

    await Employee.create({
      name,
      email,
      address,
      phone,
      role_id,
    }).then(
      (newEmployee) => response.json(newEmployee),
      () => response.status(500).json({ message: 'There was an error' })
    )
  }

  public async update({ params, request, response }: HttpContextContract) {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { name, email, address, phone, role_id } = request.body() as unknown as Employee
    const updatedEmployee = await Employee.find(params.id)

    if (updatedEmployee) {
      await updatedEmployee
        .merge({
          name,
          email,
          address,
          phone,
          role_id,
        })
        .save()
        .then(
          () =>
            response.json({
              message: `Employee with ID: ${params.id} was updated successfully`,
            }),
          () => response.status(500).json({ message: 'There was an error' })
        )
    }
  }

  public async destroy({ params, response }: HttpContextContract) {
    const employee = await Employee.findOrFail(params.id)
    if (employee) {
      await employee.delete().then(
        () =>
          response.json({
            message: `Employee with ID: ${params.id} was deleted successfully`,
          }),
        () => response.status(500).json({ message: 'There was an error' })
      )
    }
  }
}
