# How to Support Research Computing at an R1 University

This report analyzes emerging trends in Research Computing and Research Computing Support at R1 AAU research universities. It examines the current state of research computing, emerging trends, challenges and opportunities, and best practices for supporting research computing at these institutions.

## Current State of Research Computing at R1 AAU Universities

Research universities, particularly those designated as R1 institutions by the Carnegie Classification, are distinguished by their substantial investments in research and development. These institutions play a crucial role in advancing knowledge and driving innovation across various disciplines<sup>1</sup>. The R1 designation signifies "very high research activity" and is awarded to universities that meet specific criteria, including annual research expenditures and the number of doctoral degrees awarded<sup>2</sup>. The current threshold for an R1 institution is $50 million in total annual research spending and awarding 70 research doctorates annually<sup>2</sup>. Arizona State University and the University of Nevada, Reno are examples of R1 AAU research universities<sup>2</sup>.

AAU membership, while not essential, holds significance for academics as it indicates research prominence and can lead to increased resources and faculty recruitment<sup>4</sup>. Studies have shown that AAU universities awarded the majority of all research doctoral degrees in STEM and social sciences (51%) as well as in the arts, humanities, and music (63%) granted in the United States in 2021<sup>5</sup>. Loyola University Chicago's recent attainment of R1 classification highlights the growing emphasis on research within academic institutions<sup>6</sup>.

Research computing support at R1 AAU universities is characterized by a commitment to providing researchers with the necessary tools and resources to conduct their work effectively<sup>7</sup>. This support often includes high-performance computing (HPC) clusters, data management services, and access to cloud computing platforms<sup>7</sup>. For example, Aalborg University provides access to a variety of HPC platforms:

| Platform Name | Description | Access Instructions |
|---|---|---|
| Strato | Built on a Linux-based system, Strato supports data-driven research that requires enhanced processing power with both CPU and GPU capabilities. | Quicklink to application form. |
| UCloud | A digital research platform developed by the SDU eScience Center, specifically designed to deliver high-performance computing with a strong emphasis on user experience. | Quicklink to application form. |
| AI Cloud | Aalborg University's primary GPU resource, tailored for machine learning and parallel processing tasks. | Quicklink to application form. |
| AI-LAB | Designed exclusively for students at Aalborg University, offering high-performance computing (HPC) right at your fingertips. | Quicklink to application form. |

## Emerging Trends in Research Computing

### Cloud Computing

Cloud computing has emerged as a transformative technology in research computing, offering researchers access to scalable and on-demand computing resources<sup>8</sup>. Cloud platforms provide a range of services, including virtual machines, storage, networking, data management, and specialized tools for data analysis and machine learning<sup>8</sup>.

Researchers can leverage cloud computing to:

* Archive data cost-effectively with high reliability<sup>8</sup>.
* Build familiar data systems (e.g., Postgres, MySQL, Spark)<sup>8</sup>.
* Create automated and secure data feeds<sup>8</sup>.
* Maintain data repositories for collaborative research<sup>8</sup>.
* Run various programming environments (e.g., MATLAB, R, Python)<sup>8</sup>.

Cloud computing offers several advantages for research computing:

* **Scalability:** Researchers can scale their computing resources up or down as needed, paying only for the resources they use<sup>9</sup>.
* **Flexibility:** Cloud platforms offer a wide range of computing options to match specific research needs, including GPU-intensive, compute-intensive, and memory-intensive instances<sup>8</sup>.
* **Cost-effectiveness:** Cloud computing can be more cost-effective than maintaining on-premises infrastructure, especially for research projects with fluctuating computing demands<sup>9</sup>.
* **Accessibility:** Researchers can access cloud resources from anywhere with an internet connection, promoting collaboration and remote work<sup>8</sup>.

Many cloud vendors offer research grants and credits to encourage cloud adoption in academia<sup>8</sup>. For example, the AWS Research Cloud Program provides researchers with resources and support to accelerate their research in the cloud<sup>9</sup>.

### Artificial Intelligence

Artificial intelligence (AI) is rapidly transforming research computing, enabling researchers to analyze large datasets, automate tasks, and gain new insights from complex data<sup>10</sup>. AI tools are being used to support various aspects of the research process, including:

* **Hypotheses generation:** AI can automatically generate research questions based on existing data or topics<sup>10</sup>.
* **Literature review:** AI can analyze and summarize research literature, identifying relevant trends and gaps in knowledge<sup>10</sup>.
* **Data analysis:** AI can process and analyze large datasets, uncovering patterns and correlations that may not be apparent through traditional methods<sup>10</sup>.
* **Experiment design:** AI algorithms can assist in designing experiments by suggesting variables, methodologies, and potential outcomes<sup>10</sup>.
* **Communication of findings:** AI can help in drafting, proofreading, and editing research papers<sup>10</sup>.

The National Science Foundation (NSF) has been investing in AI research since the 1960s and continues to support AI-driven discoveries and technologies<sup>11</sup>. The NSF-led National Artificial Intelligence Research Institutes program connects institutions across the U.S. to advance AI research in various areas, including trustworthy AI, machine learning, and human-AI interaction<sup>11</sup>.

### Big Data

Big data refers to extremely large and complex datasets that cannot be managed or analyzed using traditional methods<sup>12</sup>. Big data analytics involves the use of advanced techniques, such as machine learning and data mining, to extract valuable insights from these datasets<sup>13</sup>.

Big data is playing an increasingly important role in research, enabling researchers to:

* Track consumer behavior and shopping habits<sup>12</sup>.
* Detect fraud in real-time<sup>12</sup>.
* Optimize logistics and supply chain operations<sup>12</sup>.
* Gain new insights from medical data<sup>12</sup>.
* Improve urban planning and infrastructure management<sup>12</sup>.

Big data analytics offers several benefits for research:

* **Improved decision-making:** By analyzing large datasets, researchers can gain a deeper understanding of phenomena and make more informed decisions<sup>13</sup>.
* **Increased agility and innovation:** Big data allows researchers to adapt quickly to new findings and accelerate the research process<sup>13</sup>.
* **Better customer experiences:** In research involving human subjects, big data can provide insights into participant behavior and preferences<sup>13</sup>.
* **Continuous intelligence:** Big data enables researchers to continuously collect and analyze data, leading to new discoveries and opportunities<sup>13</sup>.

### Emerging Battery Technologies

Advancements in battery technology are also having a significant impact on research computing. New battery technologies, such as NanoBolt lithium tungsten batteries and zinc-manganese oxide batteries, offer improved performance, increased lifespan, and enhanced safety<sup>14</sup>. These advancements are driving the development of new research tools and instruments, requiring more sophisticated computing infrastructure and support<sup>15</sup>.

Some of the key emerging battery technologies include:

* **Solid-state batteries:** These batteries use a solid electrolyte instead of a liquid one, offering greater energy density, enhanced safety, and a longer lifespan<sup>17</sup>. Solid-state batteries have the potential to revolutionize electric vehicles and other applications that require high-performance energy storage<sup>19</sup>.
* **Lithium-sulfur batteries:** These batteries offer higher energy density and lower cost compared to traditional lithium-ion batteries<sup>20</sup>. However, they currently have a shorter lifespan<sup>20</sup>. Research is ongoing to improve the lifespan and performance of lithium-sulfur batteries<sup>21</sup>.
* **Sodium-ion batteries:** These batteries use abundant and low-cost sodium instead of lithium, making them a more sustainable and affordable option<sup>22</sup>. Sodium-ion batteries also have a lower environmental impact compared to lithium-ion batteries<sup>24</sup>. While they currently have lower energy density than lithium-ion batteries, advancements are being made to improve their performance<sup>22</sup>.
* **Other battery technologies:** Researchers are also exploring other battery technologies, such as iron-air batteries<sup>29</sup>, zinc-based batteries<sup>29</sup>, and graphene batteries<sup>15</sup>. These technologies offer various advantages, including improved safety, lower cost, and increased lifespan.

The environmental impact of battery technologies is an important consideration. While some emerging technologies, such as sodium-ion batteries, offer environmental benefits, others, such as solid-state batteries, raise concerns about the environmental impact of lithium mining<sup>19</sup>. It is crucial to consider the full lifecycle environmental impact of battery technologies when making decisions about their use in research computing<sup>31</sup>.

## Emerging Trends in Research Computing Support

### DevOps

DevOps is a set of practices that combines software development (Dev) and IT operations (Ops) to shorten the systems development life cycle and provide continuous delivery with high software quality<sup>40</sup>. DevOps emphasizes collaboration, automation, and continuous improvement to increase the speed and reliability of software development and deployment<sup>41</sup>.

In the context of research computing support, DevOps can help to:

* Accelerate the delivery of research software and tools<sup>40</sup>.
* Improve the stability and reliability of research computing infrastructure<sup>41</sup>.
* Increase collaboration between researchers and IT support staff<sup>40</sup>.
* Enhance the security of research data and systems<sup>41</sup>.

DevOps practices can be applied in research computing support through the use of various tools and techniques. For example, continuous integration and continuous delivery (CI/CD) can automate the software release process, from build to deploy, ensuring that new software updates are tested and deployed quickly and reliably<sup>41</sup>. Infrastructure as code can help manage development, testing, and production environments in a repeatable and more efficient manner<sup>41</sup>. Configuration management tools can automate the process of configuring and maintaining research computing infrastructure<sup>40</sup>. Monitoring and logging practices help keep track of performance in real-time<sup>41</sup>. By adopting DevOps practices, research computing support teams can improve the efficiency and reliability of their services, enabling researchers to focus on their research<sup>43</sup>.

### Agile Methodologies

Agile methodologies are iterative and flexible approaches to project management that prioritize collaboration, customer feedback, and rapid adaptation to change<sup>45</sup>. Agile methodologies are well-suited for research projects with evolving requirements and uncertain outcomes<sup>46</sup>.

In research computing support, agile methodologies can help to:

* Improve communication and collaboration between researchers and support staff<sup>45</sup>.
* Increase the speed and efficiency of delivering research computing services<sup>47</sup>.
* Ensure that research computing support aligns with the evolving needs of researchers<sup>48</sup>.

Agile methodologies can be implemented in research computing support by adopting agile principles, such as iterative development, continuous feedback, and close collaboration<sup>47</sup>. For example, research computing support teams can use Scrum, a popular agile framework, to break down projects into smaller, more manageable sprints and incorporate researcher feedback into each iteration<sup>48</sup>. Kanban, another agile framework, can be used to visualize and manage the flow of work, ensuring that research computing support requests are addressed efficiently<sup>45</sup>. By adopting agile methodologies, research computing support teams can become more responsive to the needs of researchers and deliver services more effectively<sup>49</sup>.

### Data Science

Data science is an interdisciplinary field that uses scientific methods, processes, algorithms, and systems to extract knowledge and insights from structured and unstructured data<sup>50</sup>. Data science plays a crucial role in research computing support by providing expertise in data management, analysis, and visualization<sup>51</sup>.

Data science can help research computing support teams to:

* Develop and maintain data repositories and platforms<sup>52</sup>.
* Provide training and support to researchers on data management and analysis techniques<sup>51</sup>.
* Collaborate with researchers on data-intensive research projects<sup>50</sup>.

Data scientists can contribute to research computing support by developing tools and services that help researchers manage, analyze, and visualize their data<sup>53</sup>. They can also provide training and consultation to researchers on data science techniques and best practices<sup>51</sup>. By collaborating with researchers, data scientists can help to ensure that research computing support meets the needs of data-intensive research projects<sup>50</sup>.

## Challenges and Opportunities Facing Research Computing at R1 AAU Universities

### Challenges

* **Funding constraints:** Research universities often face challenges in securing sufficient funding to support the growing demands of research computing<sup>1</sup>. Federal budget constraints have reduced funding for research, even as other nations increase their own<sup>1</sup>.
* **Keeping pace with technological advancements:** The rapid pace of technological change in computing hardware and software requires continuous investment and adaptation<sup>54</sup>.
* **Data management and security:** Managing and securing large research datasets is a growing challenge, requiring expertise in data storage, security, and privacy<sup>55</sup>. The increasing volume of data generated by research requires advanced data management systems and skilled data scientists to ensure data quality, security, and privacy<sup>56</sup>.
* **Workforce development:** Attracting and retaining skilled research computing staff is essential to providing effective support to researchers<sup>4</sup>.
* **Sustainability concerns:** The production and disposal of batteries, which are essential for many research computing applications, can have significant environmental impacts<sup>33</sup>. The extraction of lithium, a key component in many batteries, can lead to water depletion and contamination, habitat destruction, and social and economic challenges<sup>34</sup>.
* **Ethical considerations:** The increasing use of AI in research raises ethical concerns related to bias, discrimination, plagiarism, and data privacy<sup>57</sup>. It is important to address these concerns to ensure that AI is used responsibly in research.

### Opportunities

* **Collaboration and partnerships:** Research universities can leverage collaborations with other institutions, industry partners, and government agencies to pool resources and expertise<sup>1</sup>.
* **Cloud computing:** Cloud computing offers opportunities to reduce costs, increase scalability, and access specialized computing resources<sup>7</sup>. Cloud platforms provide a range of services that can support research computing, including virtual machines, storage, networking, and data management tools<sup>58</sup>.
* **Data science:** Data science can help research universities to extract maximum value from their research data and accelerate discoveries<sup>59</sup>. Data science expertise can be used to develop and maintain data repositories, provide training and support to researchers, and collaborate on data-intensive research projects<sup>60</sup>.
* **Open science:** Open science practices, such as data sharing and open-source software, can promote collaboration and accelerate research progress<sup>61</sup>.
* **Government policies and incentives:** Governments can play a crucial role in promoting sustainable practices in research computing through policies and incentives<sup>62</sup>. For example, the EU's "Batteries Regulation" aims to increase transparency in mineral supply chains and jumpstart the circular economy by setting stringent standards for battery makers, shifting the burden of recycling to producers, and mandating targets for battery mineral recovery<sup>62</sup>. In the US, the Advanced Manufacturing Production Tax Credit provides incentives for battery production, including credits for eligible components such as electrode active materials and battery cells<sup>63</sup>.
* **Investment in battery technology:** The global investment boom in battery technology, driven by the rise of electric vehicles, presents opportunities for research universities to collaborate with industry partners and advance research in this area<sup>64</sup>. This investment can lead to the development of more sustainable and high-performance batteries, which can benefit research computing applications.
* **Sodium-ion batteries:** The environmental and economic advantages of sodium-ion batteries, such as lower material costs, improved recyclability, and reduced environmental impact, make them a promising alternative to lithium-ion batteries for research computing<sup>38</sup>.

## Best Practices for Supporting Research Computing at R1 AAU Universities

* **Develop a strategic plan for research computing:** A clear strategic plan that aligns with the university's research mission is essential for effective research computing support<sup>65</sup>.
* **Invest in robust infrastructure:** This includes HPC clusters, data storage systems, and high-speed networks<sup>7</sup>.
* **Provide comprehensive support services:** This includes training, consultation, and user support for research computing tools and technologies<sup>66</sup>.
* **Foster a culture of collaboration:** Encourage collaboration between researchers, IT staff, and data scientists<sup>67</sup>.
* **Promote data management best practices:** Provide guidance and support to researchers on data management, security, and sharing<sup>68</sup>.
* **Embrace emerging technologies:** Explore and adopt new technologies, such as cloud computing and AI, to enhance research computing support<sup>69</sup>.
* **Address ethical considerations:** Develop guidelines and best practices for the ethical use of AI in research, including addressing issues related to bias, discrimination, and data privacy<sup>69</sup>.
* **Promote sustainable practices:** Encourage the use of sustainable battery technologies, promote battery recycling, and support research into more environmentally friendly energy storage solutions<sup>68</sup>.
* **Manage industry-sponsored research:** Implement best practices for managing industry-sponsored research contracts and conflicts of interest to ensure that research activities align with the university's mission and ethical principles<sup>68</sup>.

## Conclusion

Research computing is undergoing a period of rapid transformation, driven by emerging technologies such as cloud computing, AI, and big data. R1 AAU research universities are at the forefront of these advancements, investing in infrastructure and expertise to support their research missions. However, these institutions also face challenges, including funding constraints, the need to keep pace with technological advancements, and the ethical and environmental implications of emerging technologies.

To effectively support research computing, R1 AAU universities should adopt a strategic approach that includes investing in robust infrastructure, providing comprehensive support services, fostering a culture of collaboration, and promoting data management best practices. They should also embrace emerging technologies, such as cloud computing and AI, while addressing ethical considerations and promoting sustainable practices.

By addressing these challenges and opportunities, R1 AAU universities can ensure that their research computing support remains effective and responsive to the evolving needs of researchers, enabling them to make groundbreaking discoveries and advance knowledge in their respective fields.

## Works cited

1. Research - Association of American Universities (AAU), accessed February 25, 2025, [https://www.aau.edu/research](https://www.aau.edu/research)
2. University of Nevada, Reno retains R1 designation, accessed February 25, 2025, [https://www.unr.edu/nevada-today/news/2025/r1-designation-retained](https://www.unr.edu/nevada-today/news/2025/r1-designation-retained)
3. Arizona State University - Wikipedia, accessed February 25, 2025, [https://en.wikipedia.org/wiki/Arizona_State_University](https://en.wikipedia.org/wiki/Arizona_State_University)
4. US specific question. How important is AAU membership? : r/academia - Reddit, accessed February 25, 2025, [https://www.reddit.com/r/academia/comments/1aeeu4e/us_specific_question_how_important_is_aau/](https://www.reddit.com/r/academia/comments/1aeeu4e/us_specific_question_how_important_is_aau/)
5. Leading Research Universities Report, December 18, 2023, accessed February 25, 2025, [https://www.aau.edu/newsroom/leading-research-universities-report](https://www.aau.edu/newsroom/leading-research-universities-report)
