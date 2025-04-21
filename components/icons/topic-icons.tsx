import {
  AlertCircle,
  UserRound,
  Book,
  MessageSquare,
  Calendar,
  FileText,
  Heart,
  Music,
  MapPin,
  ShoppingBag,
  Gamepad,
  Code,
  Lightbulb,
  Building,
  Briefcase,
  Brain,
  Zap,
  Target,
  Sun,
  Video,
  Plane,
  Utensils,
} from "lucide-react";
import { LucideIcon } from "lucide-react";

export const iconMap: Record<string, LucideIcon> = {
  // basic_info
  name: UserRound,
  age: UserRound,
  gender: UserRound,
  birth_date: Calendar,
  nationality: MapPin,
  ethnicity: UserRound,
  language_spoken: MessageSquare,
  allergies: AlertCircle,

  // contact_info
  email: MessageSquare,
  phone: MessageSquare,
  city: MapPin,
  country: MapPin,

  // education
  school: Book,
  degree: Book,
  major: Book,

  // demographics
  marital_status: Heart,
  number_of_children: UserRound,
  household_income: ShoppingBag,

  // work
  company: Building,
  title: Briefcase,
  working_industry: Building,
  previous_projects: FileText,
  work_skills: Code,

  // interest
  books: Book,
  movies: Video,
  music: Music,
  foods: Utensils,
  sports: Gamepad,

  // psychological
  personality: Brain,
  values: Heart,
  beliefs: Lightbulb,
  motivations: Zap,
  goals: Target,

  // life_event
  marriage: Heart,
  relocation: MapPin,
  retirement: Sun,
  travel: Plane,

  default: UserRound,
};

export const getTopicIcon = (subTopic: string): LucideIcon => {
  return iconMap[subTopic] || iconMap.default;
};
