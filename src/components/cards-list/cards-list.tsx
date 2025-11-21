import type { ReactNode } from "react";
import "./styles.css";

export type CardsListSection<T> = {
  id: string;
  title: ReactNode;
  action?: ReactNode;
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  getItemKey: (item: T, index: number) => string;
};

type CardsListProps<T> = {
  sections: CardsListSection<T>[];
};

export const CardsList = <T,>({ sections }: CardsListProps<T>) => {
  const nonEmptySections = sections.filter(({ items }) => items.length > 0);

  if (nonEmptySections.length === 0) {
    return null;
  }

  return (
    <div className="cards-list">
      {nonEmptySections.map(
        ({ id, title, action, items, renderItem, getItemKey }) => {
          const titleId = `${id}-title`;

          return (
            <section
              className="cards-list__section"
              key={id}
              aria-labelledby={titleId}
            >
              <header className="cards-list__section-header">
                <h2 className="cards-list__section-title" id={titleId}>
                  {title}
                </h2>
                {action ? (
                  <div className="cards-list__section-action">{action}</div>
                ) : null}
              </header>
              <div className="cards-list__section-grid">
                {items.map((item, index) => (
                  <div
                    className="cards-list__item"
                    key={getItemKey(item, index)}
                  >
                    {renderItem(item, index)}
                  </div>
                ))}
              </div>
            </section>
          );
        },
      )}
    </div>
  );
};
