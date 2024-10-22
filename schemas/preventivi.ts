import * as z from "zod";

export const CreateNewPersonSchema = z
  .object({
    ragioneSociale: z
      .string()
      .min(3, { message: "Inserisci una ragione sociale valida" }),
    citta: z.string().min(2, { message: "Inserisci una città valida" }),

    codiceFiscale: z.string().optional(),
    partitaIva: z.string().optional(),

    telefono: z.string().optional(),
    email: z.string().optional(),
  })
  // Verifica: deve esserci o il codice fiscale o la partita IVA, non entrambi
  .refine((data) => (data.codiceFiscale && !data.partitaIva) || (!data.codiceFiscale && data.partitaIva), {
    message: "Devi inserire o il Codice Fiscale o la Partita IVA, non entrambi",
    path: ["codiceFiscale"], // Assegna l'errore a "codiceFiscale"
  })

  // Verifica: almeno uno tra email e telefono deve essere inserito
  .refine((data) => data.telefono || data.email, {
    message: "Devi inserire almeno un contatto, email o telefono",
    path: ["telefono"], // Assegna l'errore a "telefono"
  })

  // Verifica del Codice Fiscale solo se presente
  .refine(
    (data) => {
      if (data.codiceFiscale) {
        const correct = /^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$/.exec(
          data.codiceFiscale
        );
        if(!correct){
          return false;
        }

        const codiceFiscale = data.codiceFiscale;
        const yearCode = parseInt(codiceFiscale.slice(6, 8), 10); // Prendi le due cifre dell'anno
        const monthCode = codiceFiscale[8]; // Prendi la lettera del mese
        let dayCode = parseInt(codiceFiscale.slice(9, 11), 10); // Prendi le due cifre del giorno

        // Mappa dei mesi in base alla lettera nel codice fiscale
        const monthMap: { [key: string]: number } = {
          A: 1, B: 2, C: 3, D: 4, E: 5, H: 6, L: 7, M: 8, P: 9, R: 10, S: 11, T: 12,
        };
        const month = monthMap[monthCode];
        if (!month) {
          return false; // Mese non valido
        }

        // Se il giorno è superiore a 40, è una donna (40 viene aggiunto per le donne)
        if (dayCode > 40) {
          dayCode -= 40;
        }
        
        const currentYear = new Date().getFullYear();
        const currentCentury = Math.floor(currentYear / 100) * 100; // Es: 2000 o 1900
        let year = yearCode + (yearCode <= currentYear % 100 ? currentCentury : currentCentury - 100);

        // Costruisci la data di nascita
        const birthDate = new Date(year, month - 1, dayCode); // Date accetta mesi da 0 (gennaio) a 11 (dicembre)
        
        // Verifica se la persona è maggiorenne
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const isBeforeBirthday =
          today.getMonth() < birthDate.getMonth() ||
          (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate());

        const isMaggiorenne = isBeforeBirthday ? age - 1 >= 18 : age >= 18;

        return isMaggiorenne;
      }
      return true;
    },
    {
      message: "Codice Fiscale non valido, assicurati di averlo inserito correttamente e che tu sia maggiorenne",
      path: ["codiceFiscale"], // Assegna l'errore a "codiceFiscale"
    }
  )

  // Verifica della Partita IVA solo se presente
  .refine(
    (data) => {
      if (data.partitaIva) {
        return /^\d{11}$/.exec(data.partitaIva);
      }
      return true;
    },
    {
      message: "Partita IVA non valida",
      path: ["partitaIva"], // Assegna l'errore a "partitaIva"
    }
  )

  // Verifica del Telefono solo se presente
  .refine(
    (data) => {
      if (data.telefono) {
        return data.telefono.length >= 9;
      }
      return true;
    },
    {
      message: "Numero di telefono non valido",
      path: ["telefono"], // Assegna l'errore a "telefono"
    }
  )

  // Verifica dell'email solo se presente
  .refine(
    (data) => {
      if (data.email) {
        return z.string().email().safeParse(data.email).success;
      }
      return true;
    },
    {
      message: "Email non valida",
      path: ["email"], // Assegna l'errore a "email"
    }
  );

export type CreateNewPersonType = z.infer<typeof CreateNewPersonSchema>;
