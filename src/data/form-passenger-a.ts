/**
 * The one populated form, per brief section 9. Thirty items, six sections.
 *
 * Clause references name no standard and every clausePlaceholder is written
 * from scratch in plain language. Real SANS text is SABS copyright and paywalled,
 * so none of it appears here or anywhere in the app.
 */

import type { FormDefinition } from '../types'

export const PLACEHOLDER_NOTICE =
  'Demonstration content. Checklist items and clause references are illustrative placeholders, not the published standard.'

export const formPassengerA: FormDefinition = {
  id: 'form-passenger-a',
  title: 'Comprehensive Inspection Report — Passenger Lift',
  appliesTo: ['passenger'],
  placeholderNotice: PLACEHOLDER_NOTICE,
  sections: [
    {
      id: 'A',
      title: 'Machine compartment',
      items: [
        {
          id: 'A1',
          text: 'Access route safe and unobstructed',
          failDescription: 'Machine compartment access obstructed',
          responseType: 'passFail',
          clauseRef: 'Cl. 3.1.1',
          clausePlaceholder:
            'The route to the machine compartment must be safe to walk and clear of stored material. Doors, hatches and walkways must be usable without moving anything out of the way first.',
          failSeverity: 'days30',
          defaultResponsibility: 'owner',
          photoRequiredOnFail: false,
        },
        {
          id: 'A2',
          text: 'Machine compartment temperature',
          failDescription: 'Machine compartment temperature out of range',
          responseType: 'measurement',
          unit: '°C',
          min: 5,
          max: 40,
          expectedLabel: '5 to 40 °C',
          clauseRef: 'Cl. 3.2.4',
          clausePlaceholder:
            'Air temperature at the machine is kept within a working range so control gear and lubricants behave predictably. Readings are taken at the machine, not at the door. Ventilation is the building owner’s responsibility, so a persistent high reading is graded against the owner.',
          failSeverity: 'days30',
          defaultResponsibility: 'owner',
          photoRequiredOnFail: false,
        },
        {
          id: 'A3',
          text: 'Guarding of rotating parts secure',
          failDescription: 'Rotating parts inadequately guarded',
          responseType: 'passFail',
          clauseRef: 'Cl. 3.4.1',
          clausePlaceholder:
            'Exposed rotating parts must be guarded so that a person cannot make contact during normal work at the machine. Missing or loose guarding is an immediate danger and takes the lift out of use.',
          failSeverity: 'immediate',
          defaultResponsibility: 'serviceCompany',
          photoRequiredOnFail: true,
        },
        {
          id: 'A4',
          text: 'Lighting level adequate at machine',
          failDescription: 'Inadequate lighting at machine',
          responseType: 'passFail',
          clauseRef: 'Cl. 3.2.1',
          clausePlaceholder:
            'Permanent lighting must let a technician work at the machine without holding a torch. The level is judged at the working position.',
          failSeverity: 'days30',
          defaultResponsibility: 'owner',
          photoRequiredOnFail: false,
        },
        {
          id: 'A5',
          text: 'Hand-winding instructions displayed and legible',
          failDescription: 'Hand-winding instructions missing or illegible',
          responseType: 'passFail',
          clauseRef: 'Cl. 3.6.2',
          clausePlaceholder:
            'Instructions for moving the car by hand must be displayed where that work is done, and must be readable. They are needed by someone releasing trapped passengers under pressure, which is the worst time to be guessing.',
          failSeverity: 'days90',
          defaultResponsibility: 'serviceCompany',
          photoRequiredOnFail: false,
        },
        {
          id: 'A6',
          text: 'Report copy present in machine compartment',
          failDescription: 'No report copy in machine compartment',
          responseType: 'passFail',
          clauseRef: 'Cl. 9.1.1',
          clausePlaceholder:
            'A copy of the current inspection report is kept in the machine compartment. It is the record anyone attending the lift reads first.',
          failSeverity: 'days30',
          defaultResponsibility: 'owner',
          photoRequiredOnFail: false,
        },
      ],
    },
    {
      id: 'B',
      title: 'Lift car',
      items: [
        {
          id: 'B1',
          text: 'Car lighting functional',
          failDescription: 'Car lighting not functional',
          responseType: 'passFail',
          clauseRef: 'Cl. 4.1.2',
          clausePlaceholder:
            'Normal car lighting must work on every circuit provided. Passengers are not carried in an unlit car.',
          failSeverity: 'days30',
          defaultResponsibility: 'serviceCompany',
          photoRequiredOnFail: false,
        },
        {
          id: 'B2',
          text: 'Emergency car lighting functional',
          failDescription: 'Emergency car lighting not functional',
          responseType: 'passFail',
          clauseRef: 'Cl. 4.1.3',
          clausePlaceholder:
            'The car must hold emergency lighting when normal supply is lost, for the period required. This is confirmed by isolating the supply, not by looking at the fitting.',
          failSeverity: 'days30',
          defaultResponsibility: 'serviceCompany',
          photoRequiredOnFail: false,
        },
        {
          id: 'B3',
          text: 'Emergency alarm answered',
          failDescription: 'Emergency alarm not answered within limit',
          responseType: 'measurement',
          unit: 'seconds',
          max: 30,
          expectedLabel: '≤ 30 seconds',
          clauseRef: 'Cl. 4.3.1',
          clausePlaceholder:
            'Pressing the alarm in the car must reach a person who can respond, within the stated time. Time from pressing to a human answering. An unanswered alarm removes the only route out of a stalled car, so it takes the lift out of use.',
          failSeverity: 'immediate',
          defaultResponsibility: 'serviceCompany',
          photoRequiredOnFail: false,
        },
        {
          id: 'B4',
          text: 'Door reversal device operates on obstruction',
          failDescription: 'Car door reversal device not operating',
          responseType: 'passFail',
          clauseRef: 'Cl. 4.5.2',
          clausePlaceholder:
            'The car door must stop and reopen when it meets an obstruction. A door that keeps closing on an obstruction is an immediate danger and takes the lift out of use.',
          failSeverity: 'immediate',
          defaultResponsibility: 'serviceCompany',
          photoRequiredOnFail: true,
        },
        {
          id: 'B5',
          text: 'Car mirror intact',
          failDescription: 'Car mirror cracked',
          responseType: 'passFail',
          clauseRef: 'Cl. 4.6.1',
          clausePlaceholder:
            'A car mirror, where one is fitted, must be intact and securely held. Cracked glass is a cut risk in a confined space.',
          failSeverity: 'days90',
          defaultResponsibility: 'serviceCompany',
          photoRequiredOnFail: false,
        },
        {
          id: 'B6',
          text: 'Rated load and passenger notice legible',
          failDescription: 'Rated load notice missing or illegible',
          responseType: 'passFail',
          clauseRef: 'Cl. 4.6.3',
          clausePlaceholder:
            'The rated load and the permitted number of passengers must be displayed in the car and be legible. Overloading is prevented by information as much as by controls.',
          failSeverity: 'days90',
          defaultResponsibility: 'owner',
          photoRequiredOnFail: false,
        },
        {
          id: 'B7',
          text: 'Levelling accuracy, worst floor',
          failDescription: 'Levelling accuracy out of tolerance',
          responseType: 'measurement',
          unit: 'mm',
          max: 10,
          expectedLabel: '≤ 10 mm',
          clauseRef: 'Cl. 4.4.1',
          clausePlaceholder:
            'The car floor must stop level with the landing, within tolerance, at every floor served. Record the worst floor measured. A step at the threshold is the most common cause of a fall at a lift.',
          failSeverity: 'days30',
          defaultResponsibility: 'serviceCompany',
          photoRequiredOnFail: false,
        },
      ],
    },
    {
      id: 'C',
      title: 'Landing doors and shaft',
      items: [
        {
          id: 'C1',
          text: 'Landing door interlocks operate correctly',
          failDescription: 'Landing door interlock defective',
          responseType: 'passFail',
          clauseRef: 'Cl. 5.2.1',
          clausePlaceholder:
            'A landing door must not open while the car is away from that floor, and the lift must not run with any landing door unlocked. This is the most important safety device on the installation, and a defect here takes the lift out of use immediately.',
          failSeverity: 'immediate',
          defaultResponsibility: 'serviceCompany',
          photoRequiredOnFail: true,
        },
        {
          id: 'C2',
          text: 'Door closing force',
          failDescription: 'Door closing force exceeds limit',
          responseType: 'measurement',
          unit: 'N',
          max: 150,
          expectedLabel: '≤ 150 N',
          clauseRef: 'Cl. 5.2.4',
          clausePlaceholder:
            'The force a closing landing door can exert on a person standing in the opening is limited. Measured at the leading edge, over the closing travel, and the highest reading is recorded.',
          failSeverity: 'days30',
          defaultResponsibility: 'serviceCompany',
          photoRequiredOnFail: false,
        },
        {
          id: 'C3',
          text: 'Landing call buttons and indicators functional',
          failDescription: 'Landing call button not functional',
          responseType: 'passFail',
          clauseRef: 'Cl. 5.3.2',
          clausePlaceholder:
            'Call buttons and position indicators must work at every landing the lift serves. Passengers must be able to call the lift and see where it is.',
          failSeverity: 'days90',
          defaultResponsibility: 'serviceCompany',
          photoRequiredOnFail: false,
        },
        {
          id: 'C4',
          text: 'Shaft lighting functional',
          failDescription: 'Shaft lighting not functional',
          responseType: 'passFail',
          clauseRef: 'Cl. 5.4.1',
          clausePlaceholder:
            'Permanent shaft lighting must let a person work in the shaft safely. Lamps are checked along the full travel, not only at the ends.',
          failSeverity: 'days30',
          defaultResponsibility: 'owner',
          photoRequiredOnFail: false,
        },
        {
          id: 'C5',
          text: 'No unauthorised storage or services in shaft',
          failDescription: 'Unauthorised storage or services in shaft',
          responseType: 'passFail',
          clauseRef: 'Cl. 5.5.3',
          clausePlaceholder:
            'The shaft carries lift equipment only. Stored goods, cabling and building services that do not belong to the lift are removed, because they obstruct the car and invite people into the shaft.',
          failSeverity: 'days30',
          defaultResponsibility: 'owner',
          photoRequiredOnFail: true,
        },
      ],
    },
    {
      id: 'D',
      title: 'Pit',
      items: [
        {
          id: 'D1',
          text: 'Pit clean and free of water',
          failDescription: 'Water present in lift pit',
          responseType: 'passFail',
          clauseRef: 'Cl. 6.1.2',
          clausePlaceholder:
            'The pit must be dry and clear of debris, because water and rubbish reach the buffers and the safety gear. Standing water points to the building rather than the lift, so it is graded against the owner.',
          failSeverity: 'days30',
          defaultResponsibility: 'owner',
          photoRequiredOnFail: true,
        },
        {
          id: 'D2',
          text: 'Pit stop switch functional',
          failDescription: 'Pit stop switch not functional',
          responseType: 'passFail',
          clauseRef: 'Cl. 6.2.1',
          clausePlaceholder:
            'The pit stop switch must stop the lift from inside the pit and hold it stopped. Anyone working in the pit depends on it, so a failure takes the lift out of use.',
          failSeverity: 'immediate',
          defaultResponsibility: 'serviceCompany',
          photoRequiredOnFail: false,
        },
        {
          id: 'D3',
          text: 'Buffers secure, oil level correct',
          failDescription: 'Buffer insecure or oil level low',
          responseType: 'passFail',
          clauseRef: 'Cl. 6.3.1',
          clausePlaceholder:
            'Buffers must be secure on their mountings, and oil buffers at the correct level. They are the last protection at the extremes of travel.',
          failSeverity: 'days30',
          defaultResponsibility: 'serviceCompany',
          photoRequiredOnFail: false,
        },
        {
          id: 'D4',
          text: 'Pit access ladder secure',
          failDescription: 'Pit access ladder insecure',
          responseType: 'passFail',
          clauseRef: 'Cl. 6.1.4',
          clausePlaceholder:
            'The ladder into the pit must be secure and usable with both hands free at the bottom. It is the only safe way in and out.',
          failSeverity: 'days30',
          defaultResponsibility: 'serviceCompany',
          photoRequiredOnFail: false,
        },
      ],
    },
    {
      id: 'E',
      title: 'Suspension, safety gear and brake',
      items: [
        {
          id: 'E1',
          text: 'Broken wires per rope lay, worst rope',
          failDescription: 'Broken wires exceed limit',
          responseType: 'measurement',
          unit: 'count',
          max: 4,
          expectedLabel: '≤ 4',
          clauseRef: 'Cl. 7.1.3',
          clausePlaceholder:
            'Suspension ropes are examined over their length and broken wires counted within one rope lay. Record the worst rope. A count above the limit takes the lift out of use.',
          failSeverity: 'immediate',
          defaultResponsibility: 'serviceCompany',
          photoRequiredOnFail: false,
        },
        {
          id: 'E2',
          text: 'Rope diameter, minimum measured',
          failDescription: 'Rope diameter below minimum',
          responseType: 'measurement',
          unit: 'mm',
          min: 12.4,
          expectedLabel: '≥ 12.4 mm',
          clauseRef: 'Cl. 7.1.5',
          clausePlaceholder:
            'Rope diameter is measured at the most worn point and compared with the nominal size. Loss of diameter indicates internal wear that cannot be seen, so a reading below the minimum takes the lift out of use.',
          failSeverity: 'immediate',
          defaultResponsibility: 'serviceCompany',
          photoRequiredOnFail: false,
        },
        {
          id: 'E3',
          text: 'Safety gear engages under test',
          failDescription: 'Safety gear failed to engage under test',
          responseType: 'passFail',
          clauseRef: 'Cl. 7.3.1',
          clausePlaceholder:
            'The safety gear must grip the guide rails and hold the car under test. It is what stops the car if suspension is lost, so a failure to engage is the most serious defect on this form.',
          failSeverity: 'immediate',
          defaultResponsibility: 'serviceCompany',
          photoRequiredOnFail: true,
        },
        {
          id: 'E4',
          text: 'Overspeed governor test within 12 months',
          failDescription: 'Overspeed governor test overdue',
          responseType: 'dateCheck',
          expectedLabel: 'Within 12 months',
          clauseRef: 'Cl. 7.4.2',
          clausePlaceholder:
            'The overspeed governor is tested and certified at the stated interval. What is checked here is the date of the last certified test, not the test itself.',
          failSeverity: 'days30',
          defaultResponsibility: 'serviceCompany',
          photoRequiredOnFail: false,
        },
        {
          id: 'E5',
          text: 'Brake holds 125% of rated load',
          failDescription: 'Brake failed to hold 125% of rated load',
          responseType: 'passFail',
          clauseRef: 'Cl. 7.5.1',
          clausePlaceholder:
            'The brake must hold the car with 125 percent of rated load in it, without creep. A brake that will not hold takes the lift out of use.',
          failSeverity: 'immediate',
          defaultResponsibility: 'serviceCompany',
          photoRequiredOnFail: false,
        },
      ],
    },
    {
      id: 'F',
      title: 'Signage and emergency provisions',
      items: [
        {
          id: 'F1',
          text: 'Emergency release equipment present and accessible',
          failDescription: 'Emergency release equipment missing or inaccessible',
          responseType: 'passFail',
          clauseRef: 'Cl. 8.1.1',
          clausePlaceholder:
            'Equipment for releasing trapped passengers must be present, complete, and reachable by the people authorised to use it. Kept where the release is carried out.',
          failSeverity: 'days30',
          defaultResponsibility: 'serviceCompany',
          photoRequiredOnFail: false,
        },
        {
          id: 'F2',
          text: 'Emergency contact signage correct and legible',
          failDescription: 'Emergency contact signage incorrect or illegible',
          responseType: 'passFail',
          clauseRef: 'Cl. 8.2.1',
          clausePlaceholder:
            'The number to call when someone is trapped must be displayed and correct. A wrong or missing number lengthens every entrapment.',
          failSeverity: 'days90',
          defaultResponsibility: 'owner',
          photoRequiredOnFail: false,
        },
        {
          id: 'F3',
          text: 'Out-of-service notice available',
          failDescription: 'No out-of-service notice available',
          responseType: 'passFail',
          clauseRef: 'Cl. 8.3.1',
          clausePlaceholder:
            'A notice is available to close the lift to passengers when it is taken out of service. It is recorded at inspection rather than chased between inspections.',
          failSeverity: 'nextInspection',
          defaultResponsibility: 'owner',
          photoRequiredOnFail: false,
        },
      ],
    },
  ],
}

export const forms: FormDefinition[] = [formPassengerA]

/** Every item, flattened, for lookup by id. */
export const formItems = new Map(
  forms.flatMap((f) => f.sections.flatMap((s) => s.items.map((i) => [i.id, i] as const))),
)

/** Which section an item belongs to. */
export const sectionForItem = new Map(
  forms.flatMap((f) => f.sections.flatMap((s) => s.items.map((i) => [i.id, s] as const))),
)
