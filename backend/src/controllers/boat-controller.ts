import { BoatService } from "../services/boat-service";
import { Boat } from "../models/Boat";
import express from "express";

export class BoatController {
    constructor(private boatService: BoatService = new BoatService()) {}
    public async getBoats(req: express.Request, res: express.Response): Promise<void>{
        try {
            let result = await this.boatService.returnAllBoats();
            res.status(200).json(result);
        } catch {
            console.error();
            res.status(500).json("Something went wrong!");
        }
    }
    private checkIfBoatInputIsCorrect(name: string, price: number, skipperNeeded: boolean, length: number, maxSpeed: number, sailOrMotor: 'sail' | 'motor'): boolean {
        let fieldsAreCorrect: boolean;
        name && price && skipperNeeded && length && maxSpeed && sailOrMotor &&
            price > 0 && length > 0 && maxSpeed > 0 && typeof name == 'string' && typeof price == 'number' && typeof skipperNeeded == 'boolean' && typeof length == 'number' && typeof maxSpeed == 'number' && ( sailOrMotor == 'sail' || sailOrMotor == 'motor' ) ? fieldsAreCorrect = true : fieldsAreCorrect = false
        return fieldsAreCorrect
    }
    public async addBoat(req: express.Request, res:express.Response):Promise<void> {
        const name: string = req.body.name;
        const price: number = req.body.price;
        const skipperNeeded: boolean = req.body.skipperNeeded;
        const photo: Blob | undefined | null = req.body.photo;
        const length: number = req.body.length;
        const maxSpeed: number = req.body.maxSpeed;
        const sailOrMotor: "sail" | "motor" = req.body.sailOrMotor;
        if (this.checkIfBoatInputIsCorrect(name, price, skipperNeeded, length, maxSpeed, sailOrMotor)) {
            try {
                const result = await Boat.create({name, price, skipperNeeded, photo, length, maxSpeed, sailOrMotor}); 
                res.status(200).json(result);
            } catch {
                res.status(400).json("This name is already in use");
            }
        } else {
            res.status(400).json("Invalid input");
        }
    }
}