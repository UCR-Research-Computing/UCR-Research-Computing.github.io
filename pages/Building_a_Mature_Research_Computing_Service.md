<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" class="logo" width="120"/>

# Building a Mature Research Computing Service for Major R1 AAU Universities

---

The evolution of research computing services at major R1 Association of American Universities (AAU) institutions requires a holistic strategy that integrates advanced infrastructure, robust governance, interdisciplinary collaboration, and dynamic communication frameworks. This guide synthesizes best practices from leading institutions to outline a comprehensive roadmap for establishing and sustaining world-class research computing ecosystems. By aligning technical capabilities with institutional priorities and fostering partnerships across administrative and academic units, universities can empower researchers to tackle complex challenges while maintaining compliance, scalability, and innovation.

---

## Strategic Planning and Governance

### Aligning with Institutional Priorities

A mature research computing service begins with strategic alignment between computational resources and the university’s research mission. At Harvard University’s Research Computing and Data (RCD) division, this involves proactive identification of emerging needs through regular consultations with deans, vice chancellors for research (VCRs), and faculty committees[^1]. Key steps include:

1. **Needs Assessment**: Conduct biennial surveys and focus groups to map computational demands across disciplines, as demonstrated by the University of Alaska’s 2011 HPC assessment[^5].
2. **Roadmap Development**: Create five-year plans integrating input from the provost’s office, CIO/CTO teams, and academic senate representatives, balancing short-term researcher needs with long-term infrastructure investments[^1][^5].
3. **Funding Models**: Implement hybrid funding strategies combining central institutional support (30-40%), grant-funded allocations (40-50%), and cost-recovery mechanisms for specialized services[^5][^11].

### Organizational Structure

Effective governance requires delineating responsibilities between technical operations and scientific support:

- **Technical Teams**: Report to central IT (CIO/CTO) for cluster maintenance, cloud infrastructure, and cybersecurity[^5][^19].
- **Research Facilitators**: Embedded within schools/colleges under VCR oversight, providing domain-specific expertise in code optimization, AI integration, and workflow design[^2][^13].

The University of Edinburgh’s model exemplifies this separation, with dedicated groups for HPC operations (Eddie cluster) and digital research facilitation[^16].

---

## Core Infrastructure Development

### High-Performance Computing Ecosystems

Modern research computing clusters must support diverse workloads:

- **CPU/GPU Hybrid Clusters**: Deploy nodes with NVIDIA A100/A40 GPUs for AI/ML workloads alongside traditional Xeon processors for simulations[^8][^19]. Old Dominion University’s Wahab cluster combines 240 CPU cores with 12 A100 GPUs for cybersecurity and data-intensive research[^8].
- **Condominium Model**: Allow departments to purchase dedicated nodes (e.g., USC’s Endeavour cluster) while sharing storage and networking infrastructure[^10].


### Secure Research Environments

Regulated data handling demands isolated environments like ODU’s Regulated Research Computational Environment (RRCE), which provides:

- NIST 800-171/CMMC Level 2 compliance via TiCrypt’s zero-trust architecture
- 40 TB encrypted storage with automated audit trails
- Virtual desktops preconfigured for HIPAA/NIST 800-171 workflows[^8][^19]


### Cloud and Edge Computing Integration

Hybrid architectures bridge on-premises clusters with public cloud:

- **Research Cloud Platforms**: University of Edinburgh’s Eleanor service mirrors AWS capabilities while retaining data sovereignty[^16].
- **Edge Computing Kits**: Deploy NVIDIA Jetson/Xavier devices for field researchers in environmental sciences and robotics.

---

## Research Facilitation Services

### Consultation and Code Development

Effective facilitation requires tiered support:


| Tier | Service | Example |
| :-- | :-- | :-- |
| 1 | Workflow Optimization | UCR’s HPC workflow audits improved molecular dynamics simulations by 37%[^2] |
| 2 | AI Model Development | Iowa State’s ML guides for TensorFlow/PyTorch on HPC[^7] |
| 3 | Custom Software Engineering | App State’s RCS team developed watershed modeling tools for NSF grants[^13] |

### Training Programs

Structured curricula ensure skill development:

- **Foundations**: Linux/Shell scripting (Iowa State’s 8-week course)
- **Advanced**: GPU programming (ODU’s CUDA workshops)
- **Domain-Specific**: Cryo-EM data processing (USC CARC tutorials)[^10]

---

## Leadership Engagement and Communication

### Executive Relationship Management

- **Quarterly Briefings**: Present utilization metrics and ROI analyses to provosts/CFOs using dashboards tracking grant dollars enabled by computing resources[^1][^11].
- **Advisory Boards**: Establish committees with deans and VCRs to prioritize investments, as done at Harvard[^1].


### Cross-Campus Collaboration

- **Embedded Liaisons**: Assign facilitators to engineering/medical schools to co-write grant proposals requiring computational resources[^13].
- **Joint Appointments**: Develop shared faculty positions between RCD and departments to drive interdisciplinary projects[^5].


### Multi-Channel Communication

- **Web Portals**: Harvard’s RCD site combines service catalogs, training calendars, and real-time cluster status widgets[^1].
- **Slack Workspaces**: UCR’s \#research-computing channel averages 92% query resolution within 4 hours[^2].
- **Email Digests**: Monthly newsletters highlighting user publications enabled by HPC resources[^12].

---

## Sustainability and Continuous Improvement

### Metrics-Driven Optimization

Implement KPIs across service lines:


| Metric | Target | Measurement |
| :-- | :-- | :-- |
| Cluster Utilization | >85% | Ganglia/Open XDMoD |
| User Satisfaction | >4.5/5 | Post-support surveys |
| Grant Attribution | 15% annual growth | NSF/CV analysis |

### AI-Driven Resource Allocation

Machine learning models predict demand spikes:

- **Workload Forecasting**: ARIMA models at Edinburgh reduced job wait times by 22% during genomics grant cycles[^16].
- **Auto-Scaling Cloud**: Eleanor’s Kubernetes implementation scales bioinformatics pipelines during peak sequencing periods[^16].


### Ethical Computing Frameworks

Adopt guidelines from OSTI’s responsible innovation framework:

- **Bias Audits**: Review AI training data for demographic skews in health sciences projects[^17].
- **Carbon Accounting**: Track compute emissions using tools like CodeCarbon[^17].

---

## Conclusion

Building a mature research computing service demands continuous adaptation to technological and academic trends. By integrating the five pillars of infrastructure, facilitation, governance, communication, and sustainability, R1 institutions can create ecosystems that not only support current research but also anticipate future computational challenges. Success requires deep collaboration between technical teams, researchers, and administrators—a synergy exemplified by Harvard’s RCD and Edinburgh’s Digital Research Services[^1][^16]. Emerging areas like quantum computing readiness and exascale data strategies will define the next evolution of these services, ensuring universities remain at the forefront of global research innovation.

<div style="text-align: center">⁂</div>

[^1]: https://rc.harvard.edu

[^2]: https://ucr-research-computing.github.io/pages/research_facilitation.html

[^3]: https://showme.missouri.edu/2023/how-leaders-communicate-with-employees-sets-the-tone-for-a-respectful-workplace-culture/

[^4]: https://curc.readthedocs.io

[^5]: https://www.uaf.edu/finserv/files/omb/UAF-High-Performance-Computing-Assessment--Exec-Summary-Feb2011.pdf

[^6]: https://www.usmcu.edu/Academic-Programs/Leadership-Communications-Skills-Center/

[^7]: https://research.it.iastate.edu/guides

[^8]: https://www.odu.edu/research-computing/compute

[^9]: https://consulting.commlead.uw.edu

[^10]: https://www.carc.usc.edu/user-guides

[^11]: https://dl.acm.org/doi/fullHtml/10.1145/3491418.3530289

[^12]: https://lpsonline.sas.upenn.edu/features/why-communication-essential-effective-leadership

[^13]: https://research.appstate.edu/rcs

[^14]: https://www.aau.edu/sites/default/files/AAU-Files/Key-Issues/Public Access/AAU APLU Guide to Accelerate Public Access to Research Data.pdf

[^15]: https://ccaps.umn.edu/story/role-communication-leadership

[^16]: https://edwebcontent.ed.ac.uk/sites/default/files/atoms/files/digital-research-servicesv2_0.pdf

[^17]: https://www.osti.gov/servlets/purl/2431844

[^18]: https://novakleadership.missouri.edu/research

[^19]: https://www.odu.edu/research-computing

[^20]: https://www.cuit.columbia.edu/about-research-computing-services

[^21]: https://www.hbs.edu/research-computing-services/resources/compute-cluster/running-jobs/guidelines-for-choosing-resources.aspx

[^22]: https://it.uw.edu/guides/research/hpc/research-computing-services/

[^23]: https://crc.pitt.edu

[^24]: https://www.fordham.edu/information-technology/it-services/academic-technology/research-computing/

[^25]: https://www.odu.edu/research-computing/training

[^26]: https://www.chorusaccess.org/accelerating-public-access-to-research-data-new-guide-available-from-aau-and-aplu/

[^27]: https://carey.jhu.edu/articles/50-years-leadership-communication-research

[^28]: https://ecornell.cornell.edu/courses/technology/collaborative-communication-for-technology-leaders/

[^29]: https://www.semanticscholar.org/paper/976abe864cbe957ab41a84f681cf994e143077cb

[^30]: https://pubmed.ncbi.nlm.nih.gov/17136184/

[^31]: https://www.semanticscholar.org/paper/982df168a6c03e4764bd66034edbada5019a7122

[^32]: https://www.semanticscholar.org/paper/d1953843c186c47fa7aa6cc226ee1ecb09242209

[^33]: https://www.semanticscholar.org/paper/801ef6e7cb59c26063a891c8ec9aaddd21334fbb

[^34]: https://rsmus.com/insights/topics/it-modernization-guide-enable-business-innovation.html

[^35]: https://guidehouse.com/services/technology-modernization

[^36]: https://www.cio.com/article/2066653/8-strategies-for-accelerating-it-modernization.html

[^37]: https://www.tierpoint.com/report/technology-it-modernization/

[^38]: https://screencloud.com/it/modernization

[^39]: https://www.umaryland.edu/cits/research-computing/

[^40]: http://wiki.rc.usf.edu

[^41]: https://www.nsf.gov/funding/opportunities/advanced-computing-systems-services-adapting-rapid-evolution/nsf13-528/solicitation

[^42]: https://www.youtube.com/watch?v=MRfd9bDiU9k

[^43]: https://it.hms.harvard.edu/about/departments/research-computing

[^44]: https://www.cuit.columbia.edu/about-research-computing-services

[^45]: https://carcc.org/wp-content/uploads/2019/01/CI-Professionalization-Job-Families-and-Career-Guide.pdf

[^46]: https://www.aau.edu/who-we-are/membership-policy

[^47]: https://en.wikipedia.org/wiki/Association_of_American_Universities

[^48]: https://carnegieclassifications.acenet.edu

[^49]: https://www.linkedin.com/pulse/evolution-university-leadership-reflection-modern-vasquez-heilig-24wle

[^50]: https://www.aau.edu/newsroom/leading-research-universities-report/leading-research-universities-report-january-29-2024

[^51]: https://www.k-state.edu/lead-comm/

[^52]: https://www.crowntv-us.com/blog/it-modernization-strategy/

[^53]: https://quixy.com/blog/it-modernization/

[^54]: https://webheadtech.com/blog/simple-guide-to-it-modernization-in-business/

[^55]: https://www.datahouse.com/wp-content/uploads/2022/05/Data-Modernization-White-Paper_05.14.2019.pdf

[^56]: https://www.netsolutions.com/hub/application-modernization/

[^57]: https://uc-merced.foleon.com/general/faculty-technology-guide-spring-2023/research-computing

[^58]: https://www.it.northwestern.edu/departments/it-services-support/research/

[^59]: https://listings.jobs.gmu.edu/jobs/director-research-computing-fairfax-va-virginia-united-states-other-1aef8866-e702-436a-8dcb-c2597a8fa198

[^60]: https://curc.readthedocs.io

[^61]: https://sc.edu/about/offices_and_divisions/division_of_information_technology/rc/index.php

[^62]: https://www.rc.ufl.edu/documentation/

[^63]: https://www.rc.ufl.edu

[^64]: https://library.educause.edu/topics/infrastructure-and-research-technologies/research-computing

[^65]: https://www.cuimc.columbia.edu/news/reimagining-research-computing-and-it

[^66]: https://www.stevens.edu/it/services/research-computing

[^67]: https://app.ohr.psu.edu/JobCatalog/job/view/jobCode/PSU1132

[^68]: https://library.educause.edu/resources/2012/11/research-computing-the-enabling-role-of-information-technology

[^69]: https://aws.amazon.com/blogs/publicsector/5-best-practices-for-accelerating-research-computing-with-aws/

[^70]: https://www.colorado.edu/information-technology/strategy-reports

[^71]: https://www.virtru.com/blog/compliance/cmmc/r1-universities-research

[^72]: https://policy.ku.edu/faculty-development/tenure-faculty-teaching-workload

[^73]: https://www.acenet.edu/News-Room/Pages/Carnegie-Classifications-to-Make-Major-Changes.aspx

[^74]: https://www.chronicle.com/article/carnegie-is-changing-how-it-classifies-r1-institutions-will-your-university-make-the-cut

