import requests
from bs4 import BeautifulSoup
import pandas as pd
import time
import os

HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
BASE_DIR    = os.path.dirname(os.path.abspath(__file__))
OUTPUT_PATH = os.path.join(BASE_DIR, "../ml/raw_data.csv")

SEED_CASES = [
    ("Husband beat wife repeatedly over dowry demands. She was hospitalised twice.", "domestic_violence", 3, "IPC 498A, IPC 323, DV Act 2005", "Filed FIR. Court granted protection order. Majlis Law provided legal aid. Husband arrested."),
    ("Husband strangled wife and attempted to kill her. She escaped to a neighbour's house.", "domestic_violence", 4, "IPC 307, IPC 498A, DV Act 2005", "Emergency shelter at One Stop Centre. FIR under IPC 307. Husband remanded to custody."),
    ("Husband poured kerosene on wife and set her on fire after a dowry dispute. 40% burns.", "domestic_violence", 4, "IPC 307, IPC 498A, IPC 304B", "Husband arrested. Treated at government burns unit. Convicted — 10 years imprisonment."),
    ("Husband verbally abuses wife every day in front of children. No physical violence.", "domestic_violence", 1, "DV Act 2005 Section 3, IPC 509", "Protection Officer issued formal warning. Counselling ordered."),
    ("Live-in partner physically assaulted and abandoned woman with a toddler, no financial support.", "domestic_violence", 3, "DV Act 2005, IPC 323, IPC 506", "Court granted residence order and Rs 8000/month maintenance."),
    ("Husband gambled away all savings, sold wife jewellery without consent, denies her money for food.", "domestic_violence", 2, "DV Act 2005 Section 3, IPC 406", "Court ordered Rs 5000/month maintenance."),
    ("Mother-in-law and husband harassed woman for not producing a male child. Starved her.", "domestic_violence", 3, "IPC 498A, DV Act 2005", "NCW intervened. Protection order granted."),
    ("Woman locked inside house for 6 months, denied phone and contact with family.", "domestic_violence", 3, "IPC 342, IPC 498A, DV Act 2005", "Neighbour alerted NCW. Police freed woman. FIR filed."),
    ("Husband forced wife to work as domestic help and took all her earnings.", "domestic_violence", 2, "DV Act 2005, IPC 374", "Court ordered husband to return wages and pay maintenance."),
    ("Woman beaten every time husband drank alcohol. Ribs broken on two occasions.", "domestic_violence", 4, "IPC 498A, IPC 325, DV Act 2005", "Majlis Law filed FIR. Husband convicted under IPC 325."),
    ("Husband burned her hands on stove when dinner was not ready on time.", "domestic_violence", 4, "IPC 307, IPC 326, IPC 498A", "Neighbour called police. Husband arrested. Fast-track court case filed."),
    ("Husband sent her abusive voice notes threatening to throw her out with no money.", "domestic_violence", 2, "IPC 498A, IPC 506, DV Act 2005", "Voice notes used as evidence. Protection officer issued notice."),
    ("Woman not given food for 3 days as punishment for talking to her parents on phone.", "domestic_violence", 3, "IPC 498A, DV Act 2005", "One Stop Centre gave immediate shelter. FIR filed. Husband arrested."),
    ("Husband forced wife to sign blank documents and transferred her savings to his account.", "domestic_violence", 3, "IPC 406, IPC 420, DV Act 2005", "Bank alerted. Transactions reversed by court order."),
    ("Husband threatened to take away children if wife reported domestic violence.", "domestic_violence", 3, "IPC 498A, IPC 506, DV Act 2005", "Court granted interim custody to wife. Protection order issued."),
    ("Gang rape by two men known to the victim. Family pressured her not to report.", "sexual_assault", 4, "IPC 376D, IPC 506", "One Stop Centre provided shelter. Fast-track court convicted both men."),
    ("Father-in-law sexually assaulted her repeatedly when husband was away for work.", "sexual_assault", 4, "IPC 376, IPC 498A, DV Act 2005", "iCall helpline guided her to police. FIR registered. Accused arrested."),
    ("Woman raped by auto driver on the way home at night.", "sexual_assault", 4, "IPC 376, IPC 506", "Police caught driver using CCTV. Fast-track court convicted him."),
    ("Minor girl aged 14 raped by school teacher during extra class.", "sexual_assault", 4, "POCSO Act, IPC 376", "Teacher arrested. POCSO court convicted him — 10 years jail."),
    ("Colleague drugged her drink at office party and assaulted her.", "sexual_assault", 4, "IPC 376, IPC 328", "Medical examination confirmed assault. Accused arrested. DNA evidence used."),
    ("University professor coerced student into sexual relationship for better grades.", "sexual_assault", 3, "IPC 376, POSH Act", "University ICC complaint. Police FIR filed. Professor dismissed."),
    ("Stepfather sexually abused daughter from age 10 to 15.", "sexual_assault", 4, "POCSO Act, IPC 376 AB", "Teacher reported to CWC. Stepfather arrested. Convicted — 20 years."),
    ("Woman assaulted by security guard at her apartment complex at night.", "sexual_assault", 4, "IPC 376, IPC 354", "CCTV evidence. Guard arrested same night. Fast-track case filed."),
    ("Male colleague sent explicit messages and touched her inappropriately at workplace.", "workplace_harassment", 2, "IPC 354A, POSH Act 2013", "Filed complaint with ICC. ICC found accused guilty. Terminated."),
    ("Boss threatened to fire her if she did not comply with his sexual advances.", "workplace_harassment", 2, "IPC 354A, POSH Act 2013, IPC 506", "ECC found employer guilty. Compensation offered."),
    ("Senior male teacher made obscene comments to a 17-year-old student repeatedly.", "workplace_harassment", 3, "POCSO Act Section 11, IPC 354A", "FIR under POCSO. Teacher arrested and suspended."),
    ("Doctor at government hospital demanded sexual favours to approve medical leave.", "workplace_harassment", 2, "IPC 354A, Prevention of Corruption Act", "SHe-Box complaint filed. Doctor suspended."),
    ("Employer took explicit photos of woman employee during office trip without her knowledge.", "workplace_harassment", 3, "IT Act 66E, IPC 354C, POSH Act", "ICC investigation plus police FIR. Employer convicted."),
    ("Domestic worker sexually harassed by male employer daily.", "workplace_harassment", 2, "IPC 354A, IPC 506, Payment of Wages Act", "NCW complaint. Police registered FIR. Wages recovered."),
    ("Woman nursing student harassed by senior doctor during hospital rounds.", "workplace_harassment", 2, "IPC 354A, POSH Act 2013", "External Complaints Committee filed. Doctor suspended for 2 years."),
    ("Female journalist groped by politician during press conference caught on camera.", "workplace_harassment", 2, "IPC 354, IPC 354A", "Video evidence. Politician arrested. She refused out-of-court settlement."),
    ("Stranger stalked woman for 3 months, followed her home, sent threatening messages.", "stalking", 2, "IPC 354D, IT Act 67", "FIR under IPC 354D. Restraining order granted."),
    ("Ex-boyfriend followed her to work every day after breakup, stood outside her house at night.", "stalking", 2, "IPC 354D, IPC 506", "Police warned him. He continued. FIR filed. Arrested. 3-year sentence."),
    ("Unknown man took photos of her at gym without consent, posted on social media.", "stalking", 2, "IPC 354D, IT Act 66E, IPC 354C", "Cyber cell and police complaint. Man identified. Arrested."),
    ("Man sent 200 messages a day to a woman after she rejected his proposal.", "stalking", 2, "IPC 354D, IPC 506", "Police complaint. Man arrested. Order to maintain distance issued."),
    ("Neighbour repeatedly followed her on morning walks and appeared wherever she went.", "stalking", 2, "IPC 354D", "Police FIR. Restraining order issued."),
    ("Morphed obscene photos of her face circulated on WhatsApp groups.", "cyber_crime", 3, "IT Act 66E, IT Act 67A, IPC 509", "cybercrime.gov.in complaint. Content removed. Accused traced and arrested."),
    ("Ex-husband sent nude photos to her parents as revenge after separation.", "cyber_crime", 3, "IT Act 66E, IT Act 67, IPC 354C", "Police filed case under IT Act. Platforms notified. Husband arrested."),
    ("Man created fake Instagram profile with her photos, chatted pretending to be her.", "cyber_crime", 3, "IT Act 66C, IT Act 66D, IPC 509", "Cyber cell complaint. Fake profile taken down. Perpetrator arrested."),
    ("Video of woman being assaulted was shared on pornographic websites without consent.", "cyber_crime", 4, "IT Act 67A, IPC 354C, IPC 376", "IT Cell contacted platforms for takedown. FIR filed. Accused arrested."),
    ("Boss sent obscene voice messages to female employee on work communication app.", "cyber_crime", 2, "IPC 354A, IT Act 67, POSH Act", "Screenshots preserved. ICC and police approached. Boss suspended."),
    ("Deepfake video created using her face in explicit content and shared in college group.", "cyber_crime", 4, "IT Act 66E, IT Act 67A, IPC 354C", "College FIR. Cyber cell identified creator. Expelled and arrested."),
    ("Man threatened to release her private photos if she did not pay Rs 50000.", "cyber_crime", 3, "IPC 384, IT Act 66E, IT Act 67", "Police cyber cell complaint. Man arrested. He was convicted."),
    ("Someone accessed her iCloud and shared her private photos in a Telegram group.", "cyber_crime", 4, "IT Act 66C, IT Act 67A, IPC 354C", "Cyber cell traced Telegram group admin. Arrested. Content removed."),
    ("Unknown person sent threatening emails saying he knows her location.", "cyber_stalking", 2, "IPC 507, IPC 506, IPC 354D", "Cyber cell traced sender. FIR filed. Restraining order granted."),
    ("Man sent hundreds of threatening messages on Instagram after she blocked him.", "cyber_stalking", 2, "IPC 354D, IT Act 67", "Cyber cell FIR. Platform takedown. Man arrested."),
    ("Someone created anonymous account to post her location and daily schedule publicly.", "cyber_stalking", 2, "IPC 354D, IT Act 66C", "Cyber crime complaint. Anonymous account traced. Perpetrator arrested."),
    ("Man posted her home address and phone number on a forum inviting harassment.", "cyber_stalking", 3, "IT Act 66E, IPC 509, IPC 506", "Cyber cell FIR. Forum reported for content removal. Perpetrator arrested."),
    ("In-laws demanded more dowry, confiscated jewellery, locked her inside house.", "dowry_harassment", 3, "IPC 498A, Dowry Prohibition Act 1961, IPC 342", "NCW intervened. Jewellery recovered. In-laws booked under IPC 498A."),
    ("Husband family demanded Rs 5 lakh cash 6 months after marriage, threatened to abandon her.", "dowry_harassment", 3, "IPC 498A, Dowry Prohibition Act 1961", "Police FIR. Husband and in-laws arrested."),
    ("Woman burnt to death by in-laws within 2 years of marriage due to dowry dispute.", "dowry_harassment", 4, "IPC 304B, IPC 498A, IPC 302", "All in-laws arrested under IPC 304B. Life imprisonment for husband."),
    ("Bride parents forced to give car as dowry at last minute before wedding.", "dowry_harassment", 2, "Dowry Prohibition Act 1961 Section 3 and 4", "FIR against groom family. Dowry Prohibition Officer investigated."),
    ("Husband demanded dowry via WhatsApp messages. Screenshots used as evidence.", "dowry_harassment", 2, "IPC 498A, Dowry Prohibition Act 1961", "Screenshots submitted as evidence. FIR filed."),
    ("Ex-boyfriend threw acid on her face after she refused to resume relationship.", "acid_attack", 4, "IPC 326A, IPC 326B", "FIR registered at hospital. Rs 3 lakh compensation. Chhanv Foundation rehabilitation."),
    ("Neighbour threw acid on a 16-year-old girl after she rejected his advances.", "acid_attack", 4, "IPC 326A, POCSO Act", "Arrested same day. Fast-track court. Convicted — life imprisonment."),
    ("Woman acid attacked by jilted suitor outside her college gate.", "acid_attack", 4, "IPC 326A, IPC 326B", "Witnesses helped catch attacker. 12-year sentence. Victim got compensation."),
    ("Acid thrown on woman hands by husband relatives to mark her.", "acid_attack", 4, "IPC 326A, IPC 498A", "All accused arrested. Victim received Rs 5 lakh from Victim Compensation Fund."),
    ("Minor girl aged 16 trafficked from village under false promise of factory job.", "trafficking", 4, "IPC 370, POCSO Act, ITPA", "Rescued by Prajwala. Trafficker convicted — 7 years. Girl enrolled in rehabilitation."),
    ("Woman lured to city with fake modelling job, forced into prostitution.", "trafficking", 4, "IPC 370, ITPA Section 3", "Rescued in police raid. Trafficker arrested. Victim received Ujjawala scheme support."),
    ("Bride sold by husband to another man within a month of marriage.", "trafficking", 4, "IPC 370, IPC 366", "Both men arrested. Conviction — 10 years each."),
    ("Woman forced into marriage at 15 by parents after receiving money from groom family.", "trafficking", 4, "Prohibition of Child Marriage Act 2006, IPC 370", "Childline 1098 alerted. CWC intervened. Marriage declared void."),
    ("Children trafficked from tribal village under guise of school enrollment.", "trafficking", 4, "IPC 370, JJ Act, POCSO Act", "NGO rescued 12 children. Traffickers convicted. Children rehabilitated."),
    ("Male relatives threatened to kill her for talking to a boy from another caste.", "honour_crime", 4, "IPC 506, IPC 120B, IPC 307", "High Court protection order. Relatives arrested. Woman relocated safely."),
    ("Woman killed by brother for marrying man of her choice. Honour killing.", "honour_crime", 4, "IPC 302, IPC 120B", "Brother sentenced to death. Rarest of rare ruling by Supreme Court."),
    ("Khap panchayat ordered woman and her husband to separate. Threatened violence.", "honour_crime", 4, "IPC 506, IPC 120B", "High Court stayed panchayat order. Police protection provided."),
    ("Girl family locked her up for 3 months after discovering her boyfriend from another religion.", "honour_crime", 3, "IPC 342, IPC 506, Article 21", "Habeas corpus petition in High Court. Girl released."),
    ("Woman threatened by in-laws for filing for divorce. Asked to drop case.", "honour_crime", 3, "IPC 506, IPC 120B", "Police protection granted. FIR against in-laws. Divorce proceedings continued."),
    ("Unknown men groped her in a crowded public bus. She screamed but bystanders ignored.", "molestation", 2, "IPC 354, IPC 354A", "CCTV footage used. Accused identified. Arrested."),
    ("Man rubbed against her in metro train deliberately despite there being space.", "molestation", 2, "IPC 354, IPC 509", "Metro security alerted. Man held. Police FIR filed."),
    ("Doctor examined her inappropriately during a routine check-up.", "molestation", 3, "IPC 354, IPC 354A, IMC Act", "Police FIR plus complaint to Medical Council. Doctor suspended."),
    ("Religious leader at temple touched her inappropriately under guise of blessing.", "molestation", 2, "IPC 354, IPC 354A", "Community members supported her complaint. Police FIR filed."),
    ("Plumber at her house touched her without consent while pretending to show a pipe issue.", "molestation", 2, "IPC 354", "Police complaint. Man identified through agency records. FIR filed."),
    ("Brothers refused to give her share of father property despite legal right.", "property_rights", 1, "Hindu Succession Act 2005, IPC 406", "DLSA legal aid. Civil suit filed. Settled out of court."),
    ("In-laws sold marital home without informing wife after husband death.", "property_rights", 2, "Hindu Succession Act, IPC 406, IPC 420", "Court issued stay on sale. Wife rights established."),
    ("Father gifted all property to sons, excluded daughters entirely from will.", "property_rights", 1, "Hindu Succession Act 2005", "Legal challenge filed. Court ruled in daughter favour. Equal share awarded."),
    ("Husband transferred all shared property to his mother before filing for divorce.", "property_rights", 2, "IPC 406, IPC 420, Transfer of Property Act", "Court reversed transfer as fraudulent. Property restored."),
    ("Employer withheld salary for 4 months and threatened to cancel work permit.", "labour_exploitation", 2, "Payment of Wages Act, IPC 374", "Labour commissioner complaint. Employer ordered to release dues."),
    ("Garment factory women forced to work 14-hour shifts with no overtime pay.", "labour_exploitation", 2, "Factories Act 1948, Minimum Wages Act 1948", "Labour inspector raid. Factory fined. Workers given overtime dues."),
    ("Domestic worker not paid for 6 months and threatened with police if she complained.", "labour_exploitation", 2, "Payment of Wages Act, IPC 374, IPC 506", "NGO SEWA helped file labour court case. All dues recovered."),
    ("Migrant woman worker passport confiscated by employer. Forced to work without pay.", "labour_exploitation", 3, "Bonded Labour Abolition Act, IPC 374, IPC 342", "eMigrate helpline contacted. Passport recovered. Employer arrested."),
    ("Women agricultural workers paid Rs 50 per day less than male workers for same work.", "labour_exploitation", 1, "Equal Remuneration Act 1976, Minimum Wages Act", "Labour department complaint. Employer directed to equalise pay."),
]

CRIME_KEYWORDS = {
    "acid_attack": ["acid attack", "threw acid", "acid burn", "acid on face"],
    "sexual_assault": ["rape", "gang rape", "sexual assault", "molest", "forcibly violated", "raped"],
    "domestic_violence": ["domestic violence", "husband beat", "beat wife", "in-laws", "dowry death", "strangled", "kerosene", "set fire", "burned her", "locked inside"],
    "stalking": ["stalk", "followed her home", "tracked her", "followed to work"],
    "cyber_stalking": ["threatening email", "threatening message online", "online threat", "cyber stalk", "sent hundreds of messages"],
    "cyber_crime": ["morphed photo", "obscene photo", "nude photo", "fake profile", "revenge porn", "whatsapp circulate", "deepfake", "hacked her"],
    "workplace_harassment": ["workplace harassment", "posh", "sexual advances at work", "boss threatened", "office harassment"],
    "dowry_harassment": ["dowry demand", "dowry harassment", "jewellery confiscated", "demanded dowry", "dowry death"],
    "trafficking": ["trafficking", "trafficked", "false job offer", "sold girl", "forced prostitution", "child marriage"],
    "honour_crime": ["honour killing", "honour crime", "caste threatened", "khap panchayat"],
    "molestation": ["outrage modesty", "groping", "molestation", "touched without consent", "rubbed against"],
    "property_rights": ["property rights denied", "inheritance denied", "refused property", "transferred property"],
    "labour_exploitation": ["salary withheld", "bonded labour", "forced labour", "wage theft", "passport confiscated"],
}
SEVERITY_MAP = {"acid_attack":4,"sexual_assault":4,"trafficking":4,"honour_crime":4,"domestic_violence":3,"dowry_harassment":3,"cyber_crime":3,"stalking":2,"cyber_stalking":2,"workplace_harassment":2,"molestation":2,"labour_exploitation":2,"property_rights":1}
LEGAL_MAP = {"acid_attack":"IPC 326A, IPC 326B","sexual_assault":"IPC 376, IPC 376D, POCSO Act","domestic_violence":"IPC 498A, DV Act 2005, IPC 323","stalking":"IPC 354D","cyber_stalking":"IPC 354D, IT Act 66, IPC 507","cyber_crime":"IT Act 66E, IT Act 67A, IPC 354C","workplace_harassment":"POSH Act 2013, IPC 354A","dowry_harassment":"IPC 498A, Dowry Prohibition Act 1961","trafficking":"IPC 370, POCSO Act, ITPA","honour_crime":"IPC 302, IPC 307, IPC 506","molestation":"IPC 354, IPC 354A","property_rights":"Hindu Succession Act 2005, IPC 406","labour_exploitation":"Payment of Wages Act, IPC 374"}

def classify_text(text):
    t = text.lower()
    for crime_type, keywords in CRIME_KEYWORDS.items():
        for kw in keywords:
            if kw in t:
                return crime_type, SEVERITY_MAP[crime_type], LEGAL_MAP[crime_type]
    return None, None, None

def scrape_ncw():
    records = []
    try:
        url = "https://ncw.nic.in/press-release"
        resp = requests.get(url, headers=HEADERS, timeout=15)
        soup = BeautifulSoup(resp.text, "html.parser")
        for link in soup.select("table a")[:40]:
            text = link.get_text(strip=True)
            if len(text) < 20: continue
            crime_type, severity, legal = classify_text(text)
            if crime_type:
                records.append({"description":text,"crime_type":crime_type,"severity":severity,"legal_sections":legal,"resolution":"NCW press release.","source":"ncw.nic.in"})
            time.sleep(0.2)
    except Exception as e:
        print(f"  [NCW] {e}")
    return records

def run():
    print("="*55)
    print("  SafeVoice Data Scraper")
    print("="*55)
    all_records = []
    print(f"\n[1/2] Loading {len(SEED_CASES)} seed cases...")
    for desc,crime_type,severity,legal,resolution in SEED_CASES:
        all_records.append({"description":desc,"crime_type":crime_type,"severity":severity,"legal_sections":legal,"resolution":resolution,"source":"seed_verified"})
    print(f"      done")
    print("[2/2] Scraping NCW India...")
    ncw = scrape_ncw()
    all_records.extend(ncw)
    print(f"      {len(ncw)} records")
    df = pd.DataFrame(all_records)
    df = df.drop_duplicates(subset=["description"])
    df = df[df["description"].str.len() > 20]
    os.makedirs(os.path.dirname(os.path.abspath(OUTPUT_PATH)), exist_ok=True)
    df.to_csv(OUTPUT_PATH, index=False, encoding="utf-8")
    print(f"\n  Total: {len(df)} records saved to ml/raw_data.csv")
    print("  Crime type breakdown:")
    print(df["crime_type"].value_counts().to_string())
    print("\n  Next: python ml/prepare_dataset.py")

if __name__ == "__main__":
    run()