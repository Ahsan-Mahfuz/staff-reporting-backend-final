import { NextFunction, Request, Response } from 'express'
import { z } from 'zod'
import { createSchema } from './client.validation'
import { ClientModel } from './client.model'

export const createClient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { client } = req.body
    const parsedClient = JSON.parse(client)

    const clientImage = req.file?.mimetype || ''
    const validatedData = createSchema.parse({
      ...parsedClient,
      clientImage,
    })

    const generatedUserId =
      parsedClient.name.toLowerCase().replace(/\s+/g, '') +
      parsedClient.phoneNumber

    const existingClient = await ClientModel.findOne({
      userId: generatedUserId,
    })
    if (existingClient) {
      res.status(409).json({
        message: 'Client with this name and phone number already exists.',
      })
      return
    }

    const imageUrl = req.file
      ? `/picture/client_image/${req.file.filename}`
      : null

    const adminId = (req as any).user?.userId

    if (!adminId) {
      res.status(401).json({ message: 'Unauthorized. No admin ID found.' })
      return
    }

    const newClient = new ClientModel({
      ...parsedClient,
      userId: generatedUserId,
      clientImage: imageUrl,
      createdBy: adminId,
    })

    await newClient.save()

    res.status(201).json({
      message: 'Client created successfully',
    })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: 'Validation error',
        errors: error.errors.map((err) => err.message),
      })
      return
    }
    next(error)
  }
}

export const getMyClients = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const adminId = (req as any).user?.userId

    const clients = await ClientModel.find({ createdBy: adminId })

    res.status(200).json({
      message: 'Clients fetched successfully',
      data: clients,
    })
  } catch (error) {
    next(error)
  }
}
