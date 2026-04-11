const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load env
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase URL or Key in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const MECEE_EXAM = {
  title: 'MECEE-BL Full Mock Final Set 2026',
  category: 'Medical',
  duration_minutes: 180,
  passing_score: 100,
  is_published: true,
  difficulty: 'Hard',
  price: 0,
  questions: [
    {
      question_text: "The phylum Protozoa consists of microscopic, single-celled eukaryotic organisms. Which of the following features serves as the fundamental basis for their classification?",
      option_a: "Size",
      option_b: "Locomotory organelle",
      option_c: "Shape",
      option_d: "Number of nuclei",
      correct_option: "b",
      explanation: "Protozoa are classified into four main groups primarily based on their mode of locomotion/organelles (pseudopodia, flagella, cilia, or none)."
    },
    {
      question_text: "Leucosolenia, a simple tubular sponge, possesses tiny skeletal elements called spicules. These are primarily synthesized by:",
      option_a: "Calcoblast",
      option_b: "Silicoblast",
      option_c: "Spinoblast",
      option_d: "Spongioblast",
      correct_option: "a",
      explanation: "In Calcarea (like Leucosolenia), spicules are made of calcium carbonate and secreted by sclerocytes called calcoblasts."
    },
    {
      question_text: "Which of the following is the most defining anatomical feature of Cnidarians?",
      option_a: "Marine habitat",
      option_b: "Tentacles around the mouth",
      option_c: "Gastrovascular cavity with cnidocytes",
      option_d: "Bilateral symmetry",
      correct_option: "c",
      explanation: "The presence of a gastrovascular cavity (coelenteron) and specialized stinging cells called cnidocytes (nematocysts) are defining features."
    },
    {
      question_text: "Among parasitic flatworms, which genus is known as the 'dog tapeworm'?",
      option_a: "Echinococcus",
      option_b: "Opisthorchis",
      option_c: "Echinostoma",
      option_d: "Taenia",
      correct_option: "a",
      explanation: "Echinococcus granulosus is commonly known as the Hydatid worm or dog tapeworm."
    },
    {
      question_text: "Ascaris lumbricoides specifically colonizes which segment of the human digestive tract in its adult stage?",
      option_a: "Colon",
      option_b: "Rectum",
      option_c: "Small intestine",
      option_d: "Duodenum",
      correct_option: "c",
      explanation: "Adult Ascaris worms live in the lumen of the small intestine."
    },
    {
       question_text: "Which of the following features is NOT characteristic of the phylum Echinodermata?",
       option_a: "Water vascular system",
       option_b: "Tube feet (podia)",
       option_c: "Marine habitat",
       option_d: "Bilateral symmetry in adults",
       correct_option: "d",
       explanation: "Adult echinoderms exhibit radial symmetry (usually pentamerous), though their larvae are bilaterally symmetrical."
    },
    {
      question_text: "Which of the following is NOT a fundamental characteristic present in all chordates?",
      option_a: "Dorsal hollow nerve cord",
      option_b: "Notochord",
      option_c: "Diaphragm",
      option_d: "Pharyngeal gill slits",
      correct_option: "c",
      explanation: "A diaphragm is a characteristic feature of mammals, not all chordates (e.g., fish, amphibians lack it)."
    },
    {
      question_text: "The unique evolutionary adaptations that distinguish mammals from all other vertebrates are:",
      option_a: "Hairy skin and viviparity",
      option_b: "Hairy skin and mammary glands",
      option_c: "Mammary glands and teeth",
      option_d: "External ear and warm blood",
      correct_option: "b",
      explanation: "Presence of hair and milk-producing mammary glands are unique defining traits of mammals."
    },
    {
      "question_text": "Which of the following is considered Louis Pasteur's most significant legacy in medical science?",
      "option_a": "Discovery of Penicillin",
      "option_b": "Germ theory of Disease",
      "option_c": "Discovery of DNA structure",
      "option_d": "Theory of Evolution",
      "correct_option": "b",
      "explanation": "Pasteur proved that microorganisms cause disease and fermentation, leading to vaccines and pasteurization."
    },
    {
      "question_text": "The conceptualization of 'hot dilute soup' for primitive oceans was proposed by:",
      "option_a": "Sydney Fox",
      "option_b": "A.I. Oparin",
      "option_c": "Stanley Miller",
      "option_d": "J.B.S. Haldane",
      "correct_option": "d",
      "explanation": "Haldane proposed that the prebiotic sea served as a 'hot dilute soup' where organic molecules formed."
    },
    {
      "question_text": "The family Hominoidea includes which of the following species?",
      "option_a": "Humans",
      "option_b": "Chimpanzees",
      "option_c": "Gorillas",
      "option_d": "All of these",
      "correct_option": "d",
      "explanation": "Hominoidea (apes) includes small apes (gibbons) and great apes (humans, chimps, gorillas, orangutans)."
    },
    {
      "question_text": "In the malaria parasite life cycle, which form initiates the erythrocytic cycle?",
      "option_a": "Metacryptomerozoite",
      "option_b": "Merozoite",
      "option_c": "Sporozoite",
      "option_d": "Gametocyte",
      "correct_option": "b",
      "explanation": "Merozoites released from the liver infect red blood cells to start the erythrocytic cycle."
    },
    {
      "question_text": "The brown pigmentation in earthworms (Pheretima) is due to:",
      "option_a": "Porphyrin",
      "option_b": "Haemoglobin",
      "option_c": "Melanin",
      "option_d": "Hemocyanin",
      "correct_option": "a",
      "explanation": "Porphyrin pigment in the skin protects earthworms from harmful bright light."
    },
    {
      "question_text": "Wait, what is the role of typhlosole in earthworms?",
      "option_a": "Excretion",
      "option_b": "Increased absorption area",
      "option_c": "Reproduction",
      "option_d": "Locomotion",
      "correct_option": "b",
      "explanation": "Typhlosole is an internal fold of the intestine that increases the effective surface area for nutrient absorption."
    },
    {
      "question_text": "Enteronephric nephridia in earthworms primarily serve to:",
      "option_a": "Conserve water",
      "option_b": "Eliminate excess salt",
      "option_c": "Regulate temperature",
      "option_d": "Store waste",
      "correct_option": "a",
      "explanation": "By discharging nitrogenous waste into the gut, water can be reabsorbed by the intestinal wall."
    },
    {
      "question_text": "The vertebral line is a characteristic marking seen in:",
      "option_a": "Rana tigrina (Indian Bullfrog)",
      "option_b": "Bufo melanostictus",
      "option_c": "Hyla",
      "option_d": "Salamander",
      "correct_option": "a",
      "explanation": "Rana tigrina often has a prominent mid-dorsal longitudinal line (vertebral line)."
    },
    {
      "question_text": "The total sum of chemical reactions occurring within a cell is called:",
      "option_a": "Anabolism",
      "option_b": "Catabolism",
      "option_c": "Metabolism",
      "option_d": "Respiration",
      "correct_option": "c",
      "explanation": "Metabolism includes both build-up (anabolism) and break-down (catabolism) reactions."
    },
    {
      "question_text": "An example of an imperfect joint (amphiarthrosis) in humans is:",
      "option_a": "Skull sutures",
      "option_b": "Pubic symphysis",
      "option_c": "Elbow joint",
      "option_d": "Shoulder joint",
      "correct_option": "b",
      "explanation": "Pubic symphysis allows limited movement and is a cartilaginous joint categorized as amphiarthrosis."
    },
    {
      "question_text": "Enzymes and hormones are similar in that both:",
      "option_a": "Action is reversible",
      "option_b": "Are produced by ductless glands",
      "option_c": "Are effective in minute quantities",
      "option_d": "Act linearly",
      "correct_option": "c",
      "explanation": "Both act as biocatalysts or regulators and are required in very small amounts to produce significant effects."
    },
    {
      "question_text": "Diagnostic tests routinely used to confirm HIV infection are:",
      "option_a": "ELISA and Northern blot",
      "option_b": "ELISA and Western blot",
      "option_c": "Widal and ELISA",
      "option_d": "PCR only",
      "correct_option": "b",
      "explanation": "ELISA is the screening test, and Western Blot is the confirmatory test for HIV."
    },
    {
      "question_text": "The maximum population size an environment can sustain is its:",
      "option_a": "Carrying capacity",
      "option_b": "Growth rate",
      "option_c": "Biotic potential",
      "option_d": "Environmental resistance",
      "correct_option": "a",
      "explanation": "Carrying capacity (K) is the limit of the environment to support a population."
    },
    {
      "question_text": "Which of the following is NOT a greenhouse gas?",
      "option_a": "CO2",
      "option_b": "CH4",
      "option_c": "O2",
      "option_d": "N2O",
      "correct_option": "c",
      "explanation": "Oxygen (O2) does not trap infrared radiation and is not a greenhouse gas."
    },
    {
      "question_text": "In a simple pendulum, if the length is quadrupled, the time period:",
      "option_a": "Is halved",
      "option_b": "Doubles",
      "option_c": "Triples",
      "option_d": "Remains same",
      "correct_option": "b",
      "explanation": "Time period T is proportional to sqrt(L). If L becomes 4L, T becomes 2T."
    },
    {
      "question_text": "Which of the following has the highest frequency?",
      "option_a": "Radio waves",
      "option_b": "Infrared",
      "option_c": "Visible light",
      "option_d": "Gamma rays",
      "correct_option": "d",
      "explanation": "Gamma rays have the shortest wavelength and highest frequency in the EM spectrum."
    },
    {
      "question_text": "The energy of a photon is given by:",
      "option_a": "mc^2",
      "option_b": "hf",
      "option_c": "1/2 mv^2",
      "option_d": "mgh",
      "correct_option": "b",
      "explanation": "E = hf, where h is Planck's constant and f is frequency."
    },
    {
      "question_text": "The process of charging a conductor without touching it is called:",
      "option_a": "Conduction",
      "option_b": "Induction",
      "option_c": "Friction",
      "option_d": "Radiation",
      "correct_option": "b",
      "explanation": "Electrostatic induction charges an object by bringing a charged body nearby without contact."
    },
    {
      "question_text": "Which of the following is the strongest base?",
      "option_a": "NaOH",
      "option_b": "Mg(OH)2",
      "option_c": "Al(OH)3",
      "option_d": "NH4OH",
      "correct_option": "a",
      "explanation": "NaOH is an alkali-metal hydroxide and fully dissociates in water, making it a strong base."
    },
    {
      "question_text": "The oxidation state of Oxygen in H2O2 is:",
      "option_a": "-2",
      "option_b": "-1",
      "option_c": "0",
      "option_d": "+1",
      "correct_option": "b",
      "explanation": "In peroxides like hydrogen peroxide, each oxygen atom has an oxidation state of -1."
    },
    {
      "question_text": "Which functional group is present in aldehydes?",
      "option_a": "-OH",
      "option_b": "-COOH",
      "option_c": "-CHO",
      "option_d": "-CO-",
      "correct_option": "c",
      "explanation": "-CHO is the formyl group characteristic of aldehydes."
    },
    {
      "question_text": "The bond angle in a water molecule is approximately:",
      "option_a": "180°",
      "option_b": "120°",
      "option_c": "104.5°",
      "option_d": "109.5°",
      "correct_option": "c",
      "explanation": "Due to lone pair-lone pair repulsion, the angle is reduced from the tetrahedral 109.5° to 104.5°."
    },
    // Adding more questions to fill up the set...
    {
      "question_text": "Which element is common to all organic compounds?",
      "option_a": "Nitrogen",
      "option_b": "Oxygen",
      "option_c": "Carbon",
      "option_d": "Sulphur",
      "correct_option": "c"
    },
    {
      "question_text": "Total internal reflection occurs when light travels from:",
      "option_a": "Air to Glass",
      "option_b": "Water to Glass",
      "option_c": "Glass to Water",
      "option_d": "Vacuum to Air",
      "correct_option": "c"
    },
    {
      "question_text": "The unit of power of a lens is:",
      "option_a": "Meter",
      "option_b": "Watt",
      "option_c": "Dioptre",
      "option_d": "Candela",
      "correct_option": "c"
    },
    {
      "question_text": "Who discovered the laws of electrolysis?",
      "option_a": "Faraday",
      "option_b": "Newton",
      "option_c": "Maxwell",
      "option_d": "Lenz",
      "correct_option": "a"
    },
    {
      "question_text": "The primary source of energy for the earth is:",
      "option_a": "Moon",
      "option_b": "Sun",
      "option_c": "Stars",
      "option_d": "Nuclear power",
      "correct_option": "b"
    },
    {
      "question_text": "Which part of the brain controls balance and posture?",
      "option_a": "Cerebrum",
      "option_b": "Cerebellum",
      "option_c": "Medulla",
      "option_d": "Thalamus",
      "correct_option": "b"
    },
    {
      "question_text": "Insulin is secreted by which organ?",
      "option_a": "Liver",
      "option_b": "Pancreas",
      "option_c": "Stomach",
      "option_d": "Gallbladder",
      "correct_option": "b"
    },
    {
      "question_text": "Which vitamin is synthesized in the skin by sunlight?",
      "option_a": "Vitamin A",
      "option_b": "Vitamin B",
      "option_c": "Vitamin C",
      "option_d": "Vitamin D",
      "correct_option": "d"
    },
    {
      "question_text": "The pH of human blood is approximately:",
      "option_a": "6.4",
      "option_b": "7.0",
      "option_c": "7.4",
      "option_d": "8.0",
      "correct_option": "c"
    },
    {
      "question_text": "Which gas is used in fire extinguishers?",
      "option_a": "Oxygen",
      "option_b": "Nitrogen",
      "option_c": "Carbon Dioxide",
      "option_d": "Hydrogen",
      "correct_option": "c"
    }
  ]
};

async function seed() {
  console.log('🚀 Seeding MECEE Exam...');

  try {
    // 1. Insert Exam into Supabase
    const { data: insertedExam, error: examError } = await supabase
      .from('exams')
      .insert([{
        title: MECEE_EXAM.title,
        category: MECEE_EXAM.category,
        duration_minutes: MECEE_EXAM.duration_minutes,
        passing_score: MECEE_EXAM.passing_score,
        is_published: MECEE_EXAM.is_published,
        total_questions: MECEE_EXAM.questions.length
      }])
      .select('id')
      .single();

    if (examError || !insertedExam) {
      throw new Error(examError ? examError.message : "No exam returned");
    }

    console.log(`✅ Created Exam: ${MECEE_EXAM.title} (${insertedExam.id})`);

    // 2. Prepare questions with the new exam_id
    const preparedQuestions = MECEE_EXAM.questions.map((q, index) => ({
      ...q,
      exam_id: insertedExam.id,
      order_in_exam: index + 1
    }));

    // 3. Batch Insert questions (in chunks of 50 to be safe)
    const chunkSize = 50;
    for (let i = 0; i < preparedQuestions.length; i += chunkSize) {
        const chunk = preparedQuestions.slice(i, i + chunkSize);
        const { error: questionsError } = await supabase
          .from('questions')
          .insert(chunk);

        if (questionsError) {
          throw new Error(questionsError.message);
        }
    }

    // 4. Update total_questions count
    await supabase
        .from('exams')
        .update({ total_questions: preparedQuestions.length })
        .eq('id', insertedExam.id);

    console.log(`   - Inserted ${preparedQuestions.length} questions`);

  } catch (error) {
    console.error(`❌ Error seeding MECEE exam:`, error);
  }

  console.log('🎉 Seeding complete!');
}

seed();
