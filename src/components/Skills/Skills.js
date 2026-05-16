"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import styles from "./Skills.module.css";
import Loader from "../Loader/Loader";

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSkills() {
      setLoading(true);

      try {
        const { data: allDbSkills, error: allSkillsError } = await supabase
          .from("skills")
          .select("id, name, type, link");

        if (allSkillsError) throw allSkillsError;

        const { data: projectSkills, error: projectError } = await supabase
          .from("project_skills")
          .select("skill:skills(id, name, type, link)");

        if (projectError) throw projectError;

        const { data: workSkills, error: workError } = await supabase
          .from("work_skills")
          .select("skill:skills(id, name, type, link)");

        if (workError) throw workError;

        const { data: eduSkills, error: eduError } = await supabase
          .from("education_skills")
          .select("skill:skills(id, name, type, link)");

        if (eduError) throw eduError;

        function annotateSkills(rows, origin) {
          return (rows ?? [])
            .filter((row) => row.skill)
            .map((row) => ({
              ...row.skill,
              origins: [origin],
            }));
        }

        const linkedSkills = [
          ...annotateSkills(projectSkills, "Projet"),
          ...annotateSkills(workSkills, "Exp pro"),
          ...annotateSkills(eduSkills, "Formation"),
        ];

        const uniqueSkillsMap = new Map();

        linkedSkills.forEach((skill) => {
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

        // Tous les skills de type outils sont affichés,
        // même s'ils ne sont pas liés à un projet / une exp pro / une formation
        (allDbSkills ?? []).forEach((skill) => {
          if (!skill) return;

          const normalizedType = String(skill.type || "")
            .trim()
            .toLowerCase();

          const isTool =
            normalizedType === "outils" ||
            normalizedType === "outil" ||
            normalizedType === "tools" ||
            normalizedType === "tool";

          if (!isTool) return;

          if (!uniqueSkillsMap.has(skill.id)) {
            uniqueSkillsMap.set(skill.id, {
              ...skill,
              origins: [],
            });
          }
        });

        const filtered = Array.from(uniqueSkillsMap.values())
          .filter((s) => s?.type && String(s.type).trim() !== "")
          .sort((a, b) =>
            String(a.name || "").localeCompare(String(b.name || ""), "fr", {
              sensitivity: "base",
            })
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

  if (loading) return <Loader />;

  const skillsByType = skills.reduce((acc, s) => {
    const type = String(s.type || "").trim();

    if (!acc[type]) acc[type] = [];
    acc[type].push(s);

    return acc;
  }, {});

  return (
    <section className={styles.skills} id="skills">
      <div className={styles.text}>
        <h2 className={styles.title}>Mes compétences</h2>
        <p className={styles.subtitle}>
          Cette liste, non exhaustive, montre ce que je peux vraiment faire.
          C’est un aperçu de mes compétences vérifiables à travers mes projets
          (catalogue de projets à venir), mes formations et mes expériences
          professionnelles.
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
                  <p className={styles.skillName}>{skill.name}</p>

                  {skill.origins.length > 0 && (
                    <p className={styles.skillOrigins}>
                      ({skill.origins.join(", ")})
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}