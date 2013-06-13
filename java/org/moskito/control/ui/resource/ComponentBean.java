package org.moskito.control.ui.resource;

import net.anotheria.util.NumberUtils;
import org.moskito.control.core.HealthColor;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import java.util.ArrayList;
import java.util.List;

/**
 * TODO comment this class
 *
 * @author lrosenberg
 * @since 05.06.13 22:45
 */
@XmlRootElement
public class ComponentBean {
	/**
	 * Name of the component.
	 */
	@XmlElement
	private String name;

	/**
	 * Category of the component.
	 */
	@XmlElement
	private String category;

	/**
	 * Current status of the category.
	 */
	@XmlElement
	private HealthColor color;

	/**
	 *
	 */
	@XmlElement
	private String message;

	/**
	 *
	 */
	@XmlElement
	private long lastUpdateTimestamp;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public HealthColor getColor() {
		return color;
	}

	public void setColor(HealthColor color) {
		this.color = color;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public long getLastUpdateTimestamp() {
		return lastUpdateTimestamp;
	}

	public void setLastUpdateTimestamp(long lastUpdateTimestamp) {
		this.lastUpdateTimestamp = lastUpdateTimestamp;
	}

	@XmlElement(name="ISO8601Timestamp")
	public String getISOTimestamp(){
		return NumberUtils.makeISO8601TimestampString(lastUpdateTimestamp);
	}

	private List<? extends Number> blub = new ArrayList<Integer>();
	private Number[] numbers  = new Integer[5];
}