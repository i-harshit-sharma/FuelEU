import { ShipComplianceRepository } from "../../ports/outbound";
import { ShipCompliance } from "../../domain/entities/ShipCompliance";
import { RouteRepository } from "../../ports/outbound";
export const TARGET_INTENSITY_2025 = Number(process.env.TARGET_INTENSITY_2025) || 89.3368; // gCO₂e/MJ
export const ENERGY_FACTOR_MJ_PER_TON = Number(process.env.ENERGY_FACTOR_MJ_PER_TON) || 41000; // MJ/t

export function calculateComplianceBalance(
    targetIntensity: number,
    actualIntensity: number,
    energyInScope: number
): number {
    return (targetIntensity - actualIntensity) * energyInScope;
}
export function calculateEnergyInScope(fuelConsumptionTons: number): number {
    return fuelConsumptionTons * ENERGY_FACTOR_MJ_PER_TON;
}
export class ShipComplianceService {
    constructor(
        private complianceRepo: ShipComplianceRepository,
        private routeRepo?: RouteRepository
    ) {}

    /**
     * Retrieves the compliance record for a ship for a given year.
     */
    async getCompliance(
        shipId: string,
        year: number
    ): Promise<ShipCompliance | null> {
        return this.complianceRepo.getCompliance(shipId, year);
    }

    /**
     * Saves or updates the compliance record for a ship and year.
     */
    async saveCompliance(compliance: ShipCompliance): Promise<void> {
        await this.complianceRepo.saveCompliance(compliance);
    }

    /**
     * Computes and stores the Compliance Balance (CB).
     * CB = (Target Intensity - Actual Intensity) × Energy in scope
     * Uses route data to calculate actual GHG intensity.
     */
    async computeAndStoreCB(): Promise<any> {
        if (!this.routeRepo) {
            throw new Error("RouteRepository required for CB computation");
        }

        const routes = await this.routeRepo.getAllRoutes();
        const results = [];

        for (const route of routes) {
            const energyInScope = calculateEnergyInScope(route.fuelConsumption);
            const cb = calculateComplianceBalance(
                TARGET_INTENSITY_2025,
                route.ghgIntensity,
                energyInScope
            );

            const compliance: ShipCompliance = {
                shipId: route.routeId, // Using routeId as shipId for demo
                year: route.year,
                cbGco2eq: cb,
            };

            await this.saveCompliance(compliance);
            results.push({
                shipId: compliance.shipId,
                year: compliance.year,
                cb: cb,
                energyInScope,
                targetIntensity: TARGET_INTENSITY_2025,
                actualIntensity: route.ghgIntensity,
            });
        }

        return {
            message: "CB computed and stored",
            results,
        };
    }

    /**
     * Gets the adjusted Compliance Balance after banking operations.
     * Returns the CB taking into account banked surplus/deficit applications.
     */
    async getAdjustedCB(): Promise<any> {
        // This would typically query compliance records and apply banking adjustments
        // For now, return stored CB values
        return {
            message: "Adjusted CB retrieved",
            // In a full implementation, this would calculate CB - applied_banking
            note: "Implement banking adjustments in production",
        };
    }
}