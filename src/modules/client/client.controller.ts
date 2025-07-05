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

export const editClient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { clientId } = req.params
    const { client } = req.body
    const parsedClient = JSON.parse(client)

    const clientImage = req.file?.mimetype || ''
    const validatedData = createSchema.parse({
      ...parsedClient,
      clientImage,
    })

    const adminId = (req as any).user?.userId

    if (!adminId) {
      res.status(401).json({ message: 'Unauthorized. No admin ID found.' })
      return
    }

    const targetClient = await ClientModel.findOne({
      _id: clientId,
      createdBy: adminId,
    })

    if (!targetClient) {
      res.status(404).json({ message: 'Client not found or access denied.' })
      return
    }

    const generatedUserId =
      parsedClient.name.toLowerCase().replace(/\s+/g, '') +
      parsedClient.phoneNumber

    const duplicate = await ClientModel.findOne({
      userId: generatedUserId,
      _id: { $ne: clientId },
    })
    if (duplicate) {
      res.status(409).json({
        message:
          'Another client with this name and phone number already exists.',
      })
      return
    }

    const imageUrl = req.file
      ? `/picture/client_image/${req.file.filename}`
      : targetClient.clientImage

    targetClient.name = parsedClient.name
    targetClient.phoneNumber = parsedClient.phoneNumber
    targetClient.location = parsedClient.location
    targetClient.rates = parsedClient.rates
    targetClient.userId = generatedUserId
    targetClient.clientImage = imageUrl

    await targetClient.save()

    res.status(200).json({
      message: 'Client updated successfully',
      data: targetClient,
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

    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const skip = (page - 1) * limit

    const { search } = req.query

    let filter: any = { createdBy: adminId }

    if (search && typeof search === 'string') {
      const regex = new RegExp(search, 'i')
      filter.$or = [
        { name: regex },
        { phoneNumber: regex },
        { location: regex },
        { userId: regex },
      ]
    }

    const totalClients = await ClientModel.countDocuments(filter)

    const clients = await ClientModel.find(filter).skip(skip).limit(limit)

    res.status(200).json({
      message: 'Clients fetched successfully',
      data: clients,
      pagination: {
        total: totalClients,
        page,
        limit,
        pages: Math.ceil(totalClients / limit),
      },
    })
  } catch (error) {
    next(error)
  }
}

export const getSingleClient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const adminId = (req as any).user?.userId
    const { clientId } = req.params

    const client = await ClientModel.findOne({
      _id: clientId,
      createdBy: adminId,
    })

    if (!client) {
      res.status(404).json({
        message: 'Client not found or access denied',
      })
      return
    }

    res.status(200).json({
      message: 'Client fetched successfully',
      data: client,
    })
  } catch (error) {
    next(error)
  }
}

export const blockUnblockClients = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const adminId = (req as any).user?.userId

    const { clientId } = req.params

    const client = await ClientModel.findOne({
      _id: clientId,
      createdBy: adminId,
    })

    if (!client) {
      res.status(404).json({
        message: 'Client not found or access denied',
      })
      return
    }

    client.isBlocked = !client.isBlocked
    await client.save()

    res.status(200).json({
      message: client.isBlocked
        ? 'Client blocked successfully'
        : 'Client unblocked successfully',
    })
  } catch (error) {
    next(error)
  }
}
