"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import styles from "./Skills.module.css";
import Link from "next/link";

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSkills() {
      setLoading(true);

      try {
        // --- Récupération des skills liées aux projets
        const { data: projectSkills, error: projectError } = await supabase
          .from("project_skills")
          .select("skills ( id, name, type, link )");

        if (projectError) throw projectError;

        // --- Récupération des skills liées aux expériences pro
        const { data: workSkills, error: workError } = await supabase
          .from("work_skills")
          .select("skills ( id, name, type, link )");

        if (workError) throw workError;

        // --- Récupération des skills liées aux formations
        const { data: eduSkills, error: eduError } = await supabase
          .from("education_skills")
          .select("skills ( id, name, type, link )");

        if (eduError) throw eduError;

        // --- Fonction d’annotation de l’origine
        function annotateSkills(rows, origin) {
          return (rows ?? []).map((row) => ({
            ...row.skills,
            origins: [origin],
          }));
        }

        // --- Fusion des 3 sources
        const allSkills = [
          ...annotateSkills(projectSkills, "Projet"),
          ...annotateSkills(workSkills, "Exp pro"),
          ...annotateSkills(eduSkills, "Formation"),
        ];

        // --- Dédoublonnage + fusion des origines
        const uniqueSkillsMap = new Map();

        allSkills.forEach((skill) => {
          if (!skill) return;
          if (uniqueSkillsMap.has(skill.id)) {
            const existing = uniqueSkillsMap.get(skill.id);
            existing.origins = Array.from(
              new Set([...existing.origins, ...skill.origins])
            );
          } else {
            uniqueSkillsMap.set(skill.id, skill);
          }
        });

        const uniqueSkills = Array.from(uniqueSkillsMap.values());

        // --- On garde uniquement ceux qui ont un type valide
        const filtered = uniqueSkills.filter(
          (s) => s?.type && String(s.type).trim() !== ""
        );

        setSkills(filtered);
      } catch (err) {
        console.error("Erreur lors du chargement des compétences :", err);
      } finally {
        setLoading(false);
      }
    }

    fetchSkills();
  }, []);

  if (loading) return <p>Chargement...</p>;

  // --- Regrouper par type
  const skillsByType = skills.reduce((acc, s) => {
    if (!acc[s.type]) acc[s.type] = [];
    acc[s.type].push(s);
    return acc;
  }, {});

  return (
    <section className={styles.skills} id="skills">
      <div className={styles.text}>
        <h2 className={styles.title}>Mes compétences</h2>
        <p className={styles.subtitle}>
          Voici quelques compétences issues de mes projets, formations ou
          expériences. Découvrez-en plus dans mon&nbsp;
          <Link href="/projects" className={styles.link}>
            bac à sable
          </Link>.
        </p>
      </div>

      <div className={styles.columnsContainer}>
        {Object.entries(skillsByType).map(([type, group]) => (
          <div key={type} className={styles.column}>
            <h3 className={styles.typeTitle}>{type}</h3>
            {group.map((skill) => (
              <div key={skill.id} className={styles.skillItem}>
                {skill.link && (
                  <img
                    src={skill.link}
                    alt={skill.name}
                    className={styles.skillIcon}
                    onError={(e) => (e.currentTarget.style.display = "none")}
                    loading="lazy"
                  />
                )}
                <div className={styles.skillBoxName}>
                  <p className={styles.skillName}>
                    {skill.name}{" "}
                    
                  </p>
                  <p className={styles.skillOrigins}>
                        ({skill.origins.join(", ")})
                  </p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
